import * as yaml from 'js-yaml';

const scopes = {
    'related-visitors': {
        path: '/related-visitors',
        methods: ['get'],
    }
} as const;

type scopeName = keyof typeof scopes;

export function filterSchema(schemaYaml: string, ignoredScopes: string[]): string {
    const schema = yaml.load(schemaYaml) as Record<string, any>;
    for (const scope of ignoredScopes as scopeName[]) {
        if (!scopes.hasOwnProperty(scope)) {
            console.error(`Scope ${scope} did not found in the configuration`);
            continue;
        }
        const {path, methods} = scopes[scope];
        if (schema.paths.hasOwnProperty(path)) {
            for (const method of methods) {
                if (schema.paths[path].hasOwnProperty(method)) {
                    delete schema.paths[path][method];
                }
            }
            console.log(schema.paths[path])
            if (Object.keys(schema.paths[path]).length === 0) {
                delete schema.paths[path];
            }
        }
    }
    removeUnusedSchemas(schema);
    return yaml.dump(schema);
}

export function removeUnusedSchemas(schema: Record<string, any>) {
    const usageRegistry = new Set<string>();
    walkJson(schema, '$ref', (usage) => {
        const componentName = usage['$ref'];
        usageRegistry.add(componentName);
    });

    const components = schema.components?.schemas || {};
    for (const componentName of Object.keys(components)) {
        if (!usageRegistry.has(`#/components/schemas/${componentName}`)) {
            delete components[componentName];
        }
    }
}


function walkJson(json: Record<string, any>, key: string, callback: (json: Record<string, any>) => void) {
    Object.keys(json).forEach((iteratorKey) => {
        if (iteratorKey === key) {
            callback(json);
        } else if (json[iteratorKey] && typeof json[iteratorKey] === 'object') {
            walkJson(json[iteratorKey], key, callback);
        }
    });
}
