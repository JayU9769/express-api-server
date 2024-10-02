"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BaseService", {
    enumerable: true,
    get: function() {
        return BaseService;
    }
});
const _client = require("@prisma/client");
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
let BaseService = class BaseService {
    getModelAttributes() {
        var _Prisma_dmmf_datamodel_models_find;
        return ((_Prisma_dmmf_datamodel_models_find = _client.Prisma.dmmf.datamodel.models.find((model)=>model.name === this.model)) === null || _Prisma_dmmf_datamodel_models_find === void 0 ? void 0 : _Prisma_dmmf_datamodel_models_find.fields.map((field)=>field.name)) || [];
    }
    async updateAction({ ids, field }) {
        const { name, value } = field;
        const updateData = {
            [name]: value
        };
        const whereClause = {
            id: {
                in: ids
            }
        };
        try {
            const updateResult = await this.prisma[this.model].updateMany({
                where: whereClause,
                data: updateData
            });
            return updateResult.count;
        } catch (error) {
            throw new Error(`Error updating column: ${error.message}`);
        }
    }
    async findAllPaginate({ pageNumber = 1, perPage = 10, filters = {}, q, ignoreGlobal = [], sort = 'createdAt', order = 'ASC' } = {}) {
        const skip = (pageNumber - 1) * perPage;
        const where = this.buildWhereClause(filters, q, ignoreGlobal);
        const result = await this.prisma[this.model].findMany({
            where,
            skip,
            take: perPage,
            orderBy: {
                [sort]: order.toLowerCase()
            }
        });
        const count = await this.prisma[this.model].count({
            where
        });
        return {
            count,
            rows: result
        };
    }
    buildWhereClause(filters, q, ignoreGlobal = []) {
        const whereClause = {};
        Object.keys(filters).forEach((key)=>{
            if (filters[key] !== undefined && key !== 'q') {
                if (typeof filters[key] === 'string') {
                    whereClause[key] = {
                        contains: filters[key],
                        mode: 'insensitive'
                    };
                } else {
                    whereClause[key] = filters[key];
                }
            }
        });
        if (q) {
            const globalSearchConditions = [];
            for (const key of Object.keys(this.getModelAttributes())){
                if (!ignoreGlobal.includes(key)) {
                    globalSearchConditions.push({
                        [key]: {
                            contains: q,
                            mode: 'insensitive'
                        }
                    });
                }
            }
            if (globalSearchConditions.length > 0) {
                whereClause.AND = globalSearchConditions;
            }
        }
        return whereClause;
    }
    constructor(modelName){
        _define_property(this, "prisma", void 0);
        _define_property(this, "model", void 0);
        this.prisma = new _client.PrismaClient({
            log: [
                'query',
                'info',
                'warn',
                'error'
            ]
        });
        this.model = modelName;
    }
};

//# sourceMappingURL=base.service.js.map