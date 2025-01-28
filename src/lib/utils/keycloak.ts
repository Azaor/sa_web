import Keycloak from "keycloak-js";

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
const keycloakRealm = import.meta.env.VITE_KEYCLOAK_REALM;
const keycloakClient = import.meta.env.VITE_KEYCLOAK_CLIENT;

if (!keycloakUrl) {
    throw new Error('L\'URL de Keycloak n\'est pas définie dans les variables d\'environnement.');
}
if (!keycloakRealm) {
    throw new Error('Le realm de Keycloak n\'est pas définie dans les variables d\'environnement.');
}
if (!keycloakClient) {
    throw new Error('Le client de Keycloak n\'est pas définie dans les variables d\'environnement.');
}

// Configuration Keycloak
const keycloak = new Keycloak({
    url: keycloakUrl, // URL de votre serveur Keycloak
    realm: keycloakRealm, // Le nom de votre realm
    clientId: keycloakClient, // Le client ID configuré dans Keycloak
});

export default keycloak;