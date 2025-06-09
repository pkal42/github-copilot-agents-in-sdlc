<script lang="ts">
    import { onMount } from "svelte";

    interface Game {
        id: number;
        title: string;
        description: string;
        publisher: {
            id: number;
            name: string;
        } | null;
        category: {
            id: number;
            name: string;
        } | null;
        starRating: number | null;
    }

    interface Category {
        id: number;
        name: string;
        description: string;
        game_count: number;
    }

    interface Publisher {
        id: number;
        name: string;
        description: string;
        game_count: number;
    }

    export let games: Game[] = [];
    let loading = true;
    let error: string | null = null;
    let categories: Category[] = [];
    let publishers: Publisher[] = [];
    
    // Filter state
    let selectedCategoryId: number | null = null;
    let selectedPublisherId: number | null = null;

    const fetchCategories = async (): Promise<Category[]> => {
        const response = await fetch('/api/categories');
        if (response.ok) {
            return await response.json();
        }
        throw new Error(`Failed to fetch categories: ${response.status}`);
    };

    const fetchPublishers = async (): Promise<Publisher[]> => {
        const response = await fetch('/api/publishers');
        if (response.ok) {
            return await response.json();
        }
        throw new Error(`Failed to fetch publishers: ${response.status}`);
    };

    const fetchGames = async () => {
        loading = true;
        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (selectedCategoryId !== null) {
                params.append('category_id', selectedCategoryId.toString());
            }
            if (selectedPublisherId !== null) {
                params.append('publisher_id', selectedPublisherId.toString());
            }
            
            const url = `/api/games${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);
            
            if(response.ok) {
                games = await response.json();
            } else {
                error = `Failed to fetch data: ${response.status} ${response.statusText}`;
            }
        } catch (err) {
            error = `Error: ${err instanceof Error ? err.message : String(err)}`;
        } finally {
            loading = false;
        }
    };

    const clearFilters = () => {
        selectedCategoryId = null;
        selectedPublisherId = null;
        fetchGames();
    };

    const hasActiveFilters = () => {
        return selectedCategoryId !== null || selectedPublisherId !== null;
    };

    // Reactive statement to fetch games when filters change
    $: if (selectedCategoryId !== null || selectedPublisherId !== null) {
        fetchGames();
    }

    onMount(async () => {
        try {
            // Fetch filter options and initial games in parallel
            const [categoriesData, publishersData] = await Promise.all([
                fetchCategories(),
                fetchPublishers()
            ]);
            
            categories = categoriesData;
            publishers = publishersData;
            
            // Fetch initial games
            await fetchGames();
        } catch (err) {
            error = `Error loading data: ${err instanceof Error ? err.message : String(err)}`;
            loading = false;
        }
    });
</script>

<div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 class="text-2xl font-medium text-slate-100">Featured Games</h2>
        
        <!-- Filter Controls -->
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <!-- Category Filter -->
            <div class="relative">
                <select 
                    bind:value={selectedCategoryId}
                    class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 min-w-[140px]"
                    data-testid="category-filter"
                >
                    <option value={null}>All Categories</option>
                    {#each categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
            </div>
            
            <!-- Publisher Filter -->
            <div class="relative">
                <select 
                    bind:value={selectedPublisherId}
                    class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 min-w-[140px]"
                    data-testid="publisher-filter"
                >
                    <option value={null}>All Publishers</option>
                    {#each publishers as publisher}
                        <option value={publisher.id}>{publisher.name}</option>
                    {/each}
                </select>
            </div>
            
            <!-- Clear Filters Button -->
            {#if hasActiveFilters()}
                <button 
                    on:click={clearFilters}
                    class="bg-slate-700/60 hover:bg-slate-600/60 border border-slate-600/50 hover:border-slate-500/50 rounded-lg px-3 py-2 text-slate-300 hover:text-slate-100 text-sm transition-colors duration-200 flex items-center gap-2"
                    data-testid="clear-filters"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    Clear
                </button>
            {/if}
        </div>
    </div>
    
    <!-- Active Filters Indicator -->
    {#if hasActiveFilters()}
        <div class="mb-4 flex flex-wrap gap-2" data-testid="active-filters">
            {#if selectedCategoryId !== null}
                {@const category = categories.find(c => c.id === selectedCategoryId)}
                {#if category}
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-900/60 text-blue-300 text-xs font-medium">
                        Category: {category.name}
                        <button 
                            on:click={() => { selectedCategoryId = null; }}
                            class="ml-1 hover:text-blue-100"
                            aria-label="Remove category filter"
                        >
                            <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </span>
                {/if}
            {/if}
            {#if selectedPublisherId !== null}
                {@const publisher = publishers.find(p => p.id === selectedPublisherId)}
                {#if publisher}
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-900/60 text-purple-300 text-xs font-medium">
                        Publisher: {publisher.name}
                        <button 
                            on:click={() => { selectedPublisherId = null; }}
                            class="ml-1 hover:text-purple-100"
                            aria-label="Remove publisher filter"
                        >
                            <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </span>
                {/if}
            {/if}
        </div>
    {/if}
    
    {#if loading}
        <!-- loading animation -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each Array(6) as _, i}
                <div class="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
                    <div class="p-6">
                        <div class="animate-pulse">
                            <div class="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
                            <div class="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                            <div class="h-3 bg-slate-700 rounded w-full mb-3"></div>
                            <div class="h-3 bg-slate-700 rounded w-5/6 mb-4"></div>
                            <div class="h-2 bg-slate-700 rounded-full w-full mb-2"></div>
                            <div class="h-4 bg-slate-700 rounded w-1/4 mt-4"></div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else if error}
        <!-- error display -->
        <div class="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
            <p class="text-red-400">{error}</p>
        </div>
    {:else if games.length === 0}
        <!-- no games found -->
        <div class="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
            <p class="text-slate-300">No games available at the moment.</p>
        </div>
    {:else}
        <!-- game list -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="games-grid">
            {#each games as game (game.id)}
                <a 
                    href={`/game/${game.id}`} 
                    class="group block bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-xl transition-all duration-300 hover:translate-y-[-6px]"
                    data-testid="game-card"
                    data-game-id={game.id}
                    data-game-title={game.title}
                >
                    <div class="p-6 relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div class="relative z-10">
                            <h3 class="text-xl font-semibold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors" data-testid="game-title">{game.title}</h3>
                            
                            {#if game.category || game.publisher}
                                <div class="flex gap-2 mb-3">
                                    {#if game.category}
                                        <span class="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-900/60 text-blue-300" data-testid="game-category">
                                            {game.category.name}
                                        </span>
                                    {/if}
                                    {#if game.publisher}
                                        <span class="text-xs font-medium px-2.5 py-0.5 rounded bg-purple-900/60 text-purple-300" data-testid="game-publisher">
                                            {game.publisher.name}
                                        </span>
                                    {/if}
                                </div>
                            {/if}
                            
                            <p class="text-slate-400 mb-4 text-sm line-clamp-2" data-testid="game-description">{game.description}</p>
                            
                            <div class="mt-4 text-sm text-blue-400 font-medium flex items-center">
                                <span>View details</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>