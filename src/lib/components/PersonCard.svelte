<script lang="ts">
    import type { Person } from "$lib/types";

    export let person: Person;
</script>

<div class="flex items-center px-4 py-3 bg-gray-100">
    <!-- Icône -->
    <div
        class="w-10 h-10 flex justify-center items-center bg-blue-100 text-blue-500 rounded-full mr-3"
    >
        <svg
            width="800px"
            height="800px"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            class="bi bi-person"
        >
            <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
            />
        </svg>
    </div>
    <!-- Nom & Prénom -->
    <h1 class="text-xl font-bold text-gray-700">
        {person.firstName}
        {person.name}
    </h1>
</div>
<div class="px-4 py-3">
    <p class="text-sm text-gray-600">Date de naissance :</p>
    <p class="text-lg text-gray-800 font-medium">{person.birthDate}</p>
</div>
