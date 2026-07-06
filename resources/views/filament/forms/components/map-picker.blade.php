<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div
        wire:ignore
        x-data="{
            state: $wire.$entangle('{{ $getStatePath() }}').live,
            map: null,
            marker: null,
            query: '',
            searching: false,
            searchError: null,
            init() {
                const boot = () => this.initMap();

                if (window.L) {
                    boot();
                    return;
                }

                if (! document.getElementById('leaflet-css')) {
                    const css = document.createElement('link');
                    css.id = 'leaflet-css';
                    css.rel = 'stylesheet';
                    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(css);
                }

                const existing = document.getElementById('leaflet-js');
                if (existing) {
                    existing.addEventListener('load', boot);
                    return;
                }

                const js = document.createElement('script');
                js.id = 'leaflet-js';
                js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                js.onload = boot;
                document.head.appendChild(js);
            },
            initMap() {
                const hasPoint = this.state?.lat && this.state?.lng;
                const center = hasPoint
                    ? [this.state.lat, this.state.lng]
                    : [-18.6657, 35.5296]; {{-- Moçambique --}}

                this.map = L.map(this.$refs.map).setView(center, hasPoint ? 15 : 5);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap',
                    maxZoom: 19,
                }).addTo(this.map);

                if (hasPoint) {
                    this.placeMarker(center[0], center[1]);
                }

                this.map.on('click', (e) => {
                    const lat = Math.round(e.latlng.lat * 1e7) / 1e7;
                    const lng = Math.round(e.latlng.lng * 1e7) / 1e7;
                    this.placeMarker(lat, lng);
                    this.state = { lat, lng };
                });

                setTimeout(() => this.map.invalidateSize(), 300);
            },
            async search() {
                const q = this.query.trim();
                if (! q || this.searching) return;

                this.searching = true;
                this.searchError = null;

                try {
                    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mz&q=' + encodeURIComponent(q);
                    const results = await (await fetch(url, { headers: { 'Accept-Language': 'pt' } })).json();

                    if (! results.length) {
                        this.searchError = 'Endereço não encontrado. Tente ser mais específico ou marque manualmente no mapa.';
                        return;
                    }

                    const lat = Math.round(parseFloat(results[0].lat) * 1e7) / 1e7;
                    const lng = Math.round(parseFloat(results[0].lon) * 1e7) / 1e7;

                    this.placeMarker(lat, lng);
                    this.map.setView([lat, lng], 16);
                    this.state = { lat, lng };
                } catch (e) {
                    this.searchError = 'Erro ao pesquisar o endereço. Verifique a ligação à internet.';
                } finally {
                    this.searching = false;
                }
            },
            placeMarker(lat, lng) {
                if (this.marker) {
                    this.marker.setLatLng([lat, lng]);
                    return;
                }

                this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
                this.marker.on('dragend', () => {
                    const p = this.marker.getLatLng();
                    this.state = {
                        lat: Math.round(p.lat * 1e7) / 1e7,
                        lng: Math.round(p.lng * 1e7) / 1e7,
                    };
                });
            },
        }"
    >
        <div class="flex gap-2 mb-2">
            <input
                type="text"
                x-model="query"
                x-on:keydown.enter.prevent="search()"
                placeholder="Cole ou escreva um endereço e prima Enter…"
                class="fi-input block w-full rounded-lg border-gray-300 bg-white text-sm text-gray-950 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <button
                type="button"
                x-on:click="search()"
                x-bind:disabled="searching"
                class="fi-btn rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50"
            >
                <span x-show="! searching">Localizar</span>
                <span x-show="searching">A pesquisar…</span>
            </button>
        </div>

        <p x-show="searchError" x-text="searchError" class="mb-2 text-sm text-danger-600 dark:text-danger-400"></p>

        <div
            x-ref="map"
            class="rounded-lg border border-gray-300 dark:border-gray-700"
            style="height: 20rem; z-index: 0;"
        ></div>
    </div>
</x-dynamic-component>
