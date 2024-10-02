"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RedisService", {
    enumerable: true,
    get: function() {
        return RedisService;
    }
});
const _redis = require("redis");
const _index = require("./index");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let RedisService = class RedisService {
    static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }
    async set(key, value) {
        try {
            await this.client.set(key, value);
        } catch (err) {
            console.error('Failed to set value in Redis:', err);
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        } catch (err) {
            console.error('Failed to get value from Redis:', err);
            return null;
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        } catch (err) {
            console.error('Failed to delete value from Redis:', err);
        }
    }
    async quit() {
        try {
            await this.client.quit();
        } catch (err) {
            console.error('Failed to quit Redis client:', err);
        }
    }
    constructor(){
        _define_property(this, "client", void 0);
        this.client = (0, _redis.createClient)({
            url: _index.REDIS_URL
        });
        this.client.connect().then(()=>{
            console.log('Redis client connected');
        }).catch((err)=>{
            console.error('Redis error:', err);
        });
    }
};
_define_property(RedisService, "instance", null);

//# sourceMappingURL=redis.js.map