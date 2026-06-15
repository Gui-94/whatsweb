let client = null;

export function setClient(instance) {
    client = instance;
}

export function getClient() {
    return client;
}