import { createLogger } from "shapez/core/logging";
const logger = createLogger("demon-core:item-resolver");

export class ItemResolverManager {
    constructor() {
        this.resolvers = {};
    }

    addResolver(resolverClass) {
        const resolver = new resolverClass();
        const id = resolver.id;

        if (this.resolvers[id]) {
            logger.error(`Attempted to register ${id}, but id already exists`);
            return false;
        }

        if (id.includes(";")) {
            logger.error(`"${id}" contains illegal character semicolon (";"), skipping`);
            return false;
        }

        this.resolvers[id] = resolver;
        logger.log(`Registered ${id}`);
        return true;
    }
    removeResolver(resolverClass) {
        for (const id in this.resolvers) {
            if (this.resolvers[id] instanceof resolverClass) {
                delete this.resolvers[id];
                logger.log(`Unregistered ${id}`);
                return true;
            }
        }
        logger.warn(`Tried to unregister resolver but could not find it`);
        return false;
    }

    isValidCode(root, code) {
        const index = code.indexOf(";");

        if (index === -1) {
            this.validateCode(root, code);
        }

        return this.validateCode(root, code.slice(index + 1), code.slice(0, index));
    }

    validateCode(root, data, id = null) {
        if (id === null) {
            for (const id in this.resolvers) {
                if (this.validateCode(root, data, id)) {
                    return true;
                }
            }
            return false;
        }

        const resolver = this.resolvers[id];

        if (resolver) {
            return resolver.isValidCode(root, data);
        }

        return false;
    }

    parseCode(root, code) {
        const index = code.indexOf(";");

        if (index === -1) {
            return this.getItem(root, code);
        }

        return this.getItem(root, code.slice(index + 1), code.slice(0, index));
    }

    getItem(root, data, id = null) {
        if (id === null) {
            for (const id in this.resolvers) {
                const item = this.getItem(root, data, id);
                if (item) {
                    return item;
                }
            }
            return null;
        }

        const resolver = this.resolvers[id];

        if (resolver) {
            return resolver.parseCode(root, data);
        }

        return null;
    }

    suggestCode(root, input) {
        const index = input.indexOf(";");

        if (index === -1) {
            const lower = input.toLowerCase();
            return Object.keys(this.resolvers).filter(x => x.startsWith(lower)).map(x => x + ";");
        }

        const resolver = this.resolvers[input.slice(0, index)];
        const data = input.slice(index + 1);

        if (resolver) {
            return resolver.suggestCode(root, data);
        }

        return [];
    }
}

export const itemResolverManager = new ItemResolverManager();

export function itemResolverSingleton(root, data) {
    const itemType = data.$;
    const itemData = data.data;

    const item = itemResolverManager.getItem(root, itemData, itemType);

    if (item) {
        return item;
    }

    return shapez.itemResolverSingleton(root, data);
}

typeItemSingleton.customResolver = itemResolverSingleton;