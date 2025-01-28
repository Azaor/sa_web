<script lang="ts">
    import "../app.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import keycloak from "$lib/utils/keycloak";
    import { onMount, setContext } from "svelte";

    let { children }: { children: any } = $props();

    let isAuthenticated: Boolean = $state(false);
    let userInfo = $state(keycloak.tokenParsed);
    setContext("isAuthenticated", () => {
        return isAuthenticated;
    });
    setContext("getUserInfo", () => {
        return userInfo;
    });
    onMount(async () => {
        keycloak
            .init({ onLoad: "check-sso" })
            .then((authenticated) => {
                isAuthenticated = authenticated;
                if (authenticated) {
                    userInfo = keycloak.tokenParsed;
                }
            })
            .catch((err) => {
                console.error(
                    "Erreur lors de l'initialisation de Keycloak",
                    err,
                );
            });
        setInterval(() => {
            keycloak
                .updateToken(30) // Renouvelle le token s'il reste moins de 30s avant l'expiration
                .then((refreshed) => {
                    if (refreshed) {
                        console.log("Token refreshed");
                    }
                })
                .catch((e) => {
                    console.error("Failed to refresh token, " + e);
                });
        }, 10000); // Vérifie toutes les 10 secondes
    });
    $effect(() => {});
</script>

<div class="bg-gray-100 min-h-screen flex flex-col">
    <!-- Navbar -->
    <div class="w-full text-white">
        <div class="flex justify-center">
            <div class="max-w-6xl w-full bg-gray-900 shadow-md">
                <Navbar
                    links={[
                        { href: "/", label: "Accueil" },
                        { href: "/persons", label: "Personnalités" },
                        { href: "/speeches", label: "Discours" },
                    ]}
                    {isAuthenticated}
                    {userInfo}
                />
            </div>
        </div>
    </div>

    <!-- Contenu principal -->
    <main class="flex justify-center w-full flex-grow py-10">
        <div
            class="max-w-6xl w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-800"
        >
            {@render children?.()}
        </div>
    </main>
</div>
