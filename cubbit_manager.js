/**
 * FIXED CUBBIT MANAGER
 * Resolves HTTP 403 authentication errors
 */

const CubbitManager = {
    config: {
        endpoint: 's3.cubbit.eu',
        region: 'eu-west-1',
        bucket: '',
        accessKeyId: '',
        secretAccessKey: '',
        useSSL: true
    },

    state: {
        connected: false,
        files: [],
        folders: [],
        currentPath: ''
    },

    async connect(accessKeyId, secretAccessKey, bucket) {
        console.log('🔌 Connecting to Cubbit...');

        this.config.accessKeyId = accessKeyId;
        this.config.secretAccessKey = secretAccessKey;
        this.config.bucket = bucket;

        this.state.connected = true;

        try {
            const files = await this.listFiles('');
            this.saveConfig();
            console.log('✅ Connected to Cubbit successfully');
            return { success: true, files };
        } catch (error) {
            console.error('❌ Connection failed:', error);
            this.state.connected = false;
            return { success: false, error: error.message };
        }
    },

    disconnect() {
        this.state.connected = false;
        this.config.accessKeyId = '';
        this.config.secretAccessKey = '';
        console.log('🔌 Disconnected from Cubbit');
    },

    async listFiles(path = '') {
        if (!this.state.connected) {
            throw new Error('Not connected to Cubbit');
        }

        const queryParams = path ? { prefix: path, delimiter: '/' } : { delimiter: '/' };
        const url = this.buildS3Url('', queryParams);

        try {
            const headers = await this.getAuthHeaders('GET', '', queryParams);
            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorText}`);
            }

            const xml = await response.text();
            const files = this.parseS3ListResponse(xml);

            this.state.files = files.files;
            this.state.folders = files.folders;
            this.state.currentPath = path;

            return files;
        } catch (error) {
            console.error('❌ List files failed:', error);
            throw error;
        }
    },

    async uploadFile(file, path = '', metadata = {}) {
        if (!this.state.connected) {
            throw new Error('Not connected to Cubbit');
        }

        const key = path ? `${path}/${file.name}` : file.name;
        const url = this.buildS3Url(key);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const payloadHash = await this.sha256Bytes(uint8Array);
            
            const headers = await this.getAuthHeaders('PUT', key, {}, payloadHash);
            headers['Content-Type'] = file.type || 'application/octet-stream';
            headers['Content-Length'] = file.size.toString();

            Object.entries(metadata).forEach(([k, v]) => {
                headers[`x-amz-meta-${k}`] = v;
            });

            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: uint8Array
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.statusText}\n${errorText}`);
            }

            console.log(`📤 Uploaded: ${key}`);
            return { success: true, key, size: file.size };
        } catch (error) {
            console.error(`❌ Upload failed for ${file.name}:`, error);
            throw error;
        }
    },

    async downloadFile(key) {
        if (!this.state.connected) {
            throw new Error('Not connected to Cubbit');
        }

        const url = this.buildS3Url(key);

        try {
            const headers = await this.getAuthHeaders('GET', key);
            const response = await fetch(url, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`Download failed: ${response.statusText}`);
            }

            const blob = await response.blob();
            console.log(`📥 Downloaded: ${key}`);

            return {
                success: true,
                key,
                blob,
                size: blob.size
            };
        } catch (error) {
            console.error(`❌ Download failed for ${key}:`, error);
            throw error;
        }
    },

    async deleteFile(key) {
        if (!this.state.connected) {
            throw new Error('Not connected to Cubbit');
        }

        const url = this.buildS3Url(key);

        try {
            const headers = await this.getAuthHeaders('DELETE', key);
            const response = await fetch(url, {
                method: 'DELETE',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.statusText}`);
            }

            console.log(`🗑️ Deleted: ${key}`);
            return { success: true, key };
        } catch (error) {
            console.error(`❌ Delete failed for ${key}:`, error);
            throw error;
        }
    },

    buildS3Url(key, params = {}) {
        const protocol = this.config.useSSL ? 'https' : 'http';
        const host = `${this.config.bucket}.${this.config.endpoint}`;
        
        let url = `${protocol}://${host}`;
        if (key) {
            const encodedKey = key.split('/').map(segment => encodeURIComponent(segment)).join('/');
            url += `/${encodedKey}`;
        } else {
            url += '/';
        }

        if (Object.keys(params).length > 0) {
            const queryString = Object.entries(params)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => {
                    if (v === '' || v === null || v === undefined) {
                        return encodeURIComponent(k);
                    }
                    return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
                })
                .join('&');
            url += `?${queryString}`;
        }

        return url;
    },

    async getAuthHeaders(method, key = '', queryParams = {}, payloadHash = null) {
        const now = new Date();
        const amzDate = this.getAmzDate(now);
        const dateStamp = this.getDateStamp(now);
        
        const canonicalUri = key ? `/${key.split('/').map(segment => encodeURIComponent(segment)).join('/')}` : '/';
        const canonicalQueryString = this.buildCanonicalQueryString(queryParams);
        
        const host = `${this.config.bucket}.${this.config.endpoint}`;
        
        const contentHash = payloadHash || 'UNSIGNED-PAYLOAD';
        
        const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${contentHash}\nx-amz-date:${amzDate}\n`;
        const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
        
        const canonicalRequest = [
            method,
            canonicalUri,
            canonicalQueryString,
            canonicalHeaders,
            signedHeaders,
            contentHash
        ].join('\n');
        
        const credentialScope = `${dateStamp}/${this.config.region}/s3/aws4_request`;
        const canonicalRequestHash = await this.sha256(canonicalRequest);
        
        const stringToSign = [
            'AWS4-HMAC-SHA256',
            amzDate,
            credentialScope,
            canonicalRequestHash
        ].join('\n');
        
        const signature = await this.calculateSignature(stringToSign, dateStamp);
        const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${this.config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
        
        return {
            'Host': host,
            'x-amz-date': amzDate,
            'x-amz-content-sha256': contentHash,
            'Authorization': authorizationHeader
        };
    },

    async calculateSignature(stringToSign, dateStamp) {
        const kDate = await this.hmacSHA256(dateStamp, 'AWS4' + this.config.secretAccessKey);
        const kRegion = await this.hmacSHA256(this.config.region, kDate);
        const kService = await this.hmacSHA256('s3', kRegion);
        const kSigning = await this.hmacSHA256('aws4_request', kService);
        const signature = await this.hmacSHA256(stringToSign, kSigning);
        
        return this.toHex(new Uint8Array(signature));
    },

    async hmacSHA256(data, key) {
        const keyBytes = typeof key === 'string' ? new TextEncoder().encode(key) : new Uint8Array(key);
        const dataBytes = new TextEncoder().encode(data);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBytes);
        return signature;
    },

    async sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async sha256Bytes(bytes) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    getAmzDate(date) {
        return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
    },

    getDateStamp(date) {
        return date.toISOString().substring(0, 10).replace(/-/g, '');
    },

    buildCanonicalQueryString(params) {
        if (Object.keys(params).length === 0) return '';
        
        return Object.keys(params)
            .sort()
            .map(key => {
                const value = params[key];
                if (value === '' || value === null || value === undefined) {
                    return encodeURIComponent(key);
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            })
            .join('&');
    },

    toHex(buffer) {
        return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    parseS3ListResponse(xml) {
        const files = [];
        const folders = [];

        const contentsRegex = /<Contents>[\s\S]*?<Key>(.*?)<\/Key>[\s\S]*?<Size>(.*?)<\/Size>[\s\S]*?<LastModified>(.*?)<\/LastModified>[\s\S]*?<\/Contents>/g;
        let match;
        while ((match = contentsRegex.exec(xml)) !== null) {
            files.push({
                key: match[1],
                size: parseInt(match[2]),
                lastModified: match[3],
                name: match[1].split('/').pop()
            });
        }

        const prefixRegex = /<CommonPrefixes>[\s\S]*?<Prefix>(.*?)<\/Prefix>[\s\S]*?<\/CommonPrefixes>/g;
        while ((match = prefixRegex.exec(xml)) !== null) {
            folders.push({
                prefix: match[1],
                name: match[1].split('/').filter(p => p).pop()
            });
        }

        return { files, folders };
    },

    saveConfig() {
        localStorage.setItem('cubbit_config', JSON.stringify({
            bucket: this.config.bucket,
            accessKeyId: this.config.accessKeyId,
            secretAccessKey: this.config.secretAccessKey
        }));
    },

    loadConfig() {
        const saved = localStorage.getItem('cubbit_config');
        if (saved) {
            const config = JSON.parse(saved);
            Object.assign(this.config, config);
        }
    }
};

window.CubbitManager = CubbitManager;
console.log('✅ Fixed Cubbit Manager loaded');
