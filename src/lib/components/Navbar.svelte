<script lang="ts">
    import keycloak from "$lib/utils/keycloak";

    let {
        links,
        isAuthenticated,
        userInfo,
    }: {
        links: { href: string; label: string }[];
        isAuthenticated: Boolean;
        userInfo: any;
    } = $props();
    let isDrawerOpen = $state(false);

    const toggleUserMenu = () => {
        isDrawerOpen = !isDrawerOpen;
    };
</script>

<nav
    class="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-4 border-b border-blue-200 flex justify-between items-center"
>
    <!-- Logo et liens principaux -->
    <div class="flex items-center space-x-6">
        <a
            href="/"
            class="text-2xl font-bold text-blue-700 hover:text-blue-900"
        >
            Speech<span class="text-blue-500">Analytics</span>
        </a>
        <div class="hidden md:flex space-x-4">
            {#each links as link}
                <a
                    href={link.href}
                    class="text-blue-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-900 transition-all"
                >
                    {link.label}
                </a>
            {/each}
        </div>
    </div>

    <!-- Boutons ou utilisateur -->
    <div class="flex items-center space-x-4">
        {#if !isAuthenticated}
            <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-md shadow hover:from-blue-500 hover:to-blue-400 hover:shadow-md transition-all"
                onclick={async () => {
                    await keycloak.login();
                }}
            >
                Se connecter
            </button>
        {:else if isAuthenticated}
            <div class="relative">
                <button
                    class="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-all"
                    onclick={toggleUserMenu}
                >
                    <div
                        class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white flex items-center justify-center text-sm font-semibold"
                    >
                        {userInfo.name.charAt(0) || ""}
                    </div>
                    <span
                        class="hidden sm:block text-blue-700 text-sm font-medium"
                    >
                        {userInfo.name}
                    </span>
                </button>

                <!-- Menu utilisateur -->
                {#if isDrawerOpen}
                    <div
                        class="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-md shadow-lg overflow-hidden z-10"
                    >
                        <div class="p-3">
                            <p class="text-sm font-semibold text-blue-900">
                                {userInfo.name}
                            </p>
                            <p class="text-xs text-blue-600">
                                {userInfo.email}
                            </p>
                        </div>
                        <div class="border-t border-blue-100">
                            <button
                                onclick={() => keycloak.logout()}
                                class="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-all"
                            >
                                Déconnexion
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</nav>
