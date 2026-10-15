# Especificación Técnica: Guía Universal Meta Pokédex para AYN Thor (Segunda Pantalla)

**Fecha:** 2026-10-15  
**Estado:** Aprobado para Planificación  
**Dispositivo Destino:** AYN Thor (Pantalla Secundaria inferior, relación de aspecto 31:27, 1240x1080 nativa / 620x540 base)  

---

## 1. Resumen Ejecutivo y Objetivos

El objetivo de esta especificación es convertir la interfaz existente de la Pokédex en una aplicación web interactiva, ultra-optimizada y 100% funcional orientada a guiar a jugadores que no dominan el metagame de Pokémon.

### Requerimientos Clave:
1. **Preservación Estricta de UX/UI y Diseño:** Cero alteraciones en el layout, colores (AMOLED/Shell), botones biselados (chamfer), docks, animaciones, tipografía y proporción de pantalla (31:27). La interfaz debe permanecer idéntica a nivel visual.
2. **Recomendación Inteligente de Equipo basada en Equipo Activo + PC (Caja):**
   - El motor de sinergia analiza el equipo actual (hasta 6 Pokémon).
   - Identifica amenazas críticas (3+ miembros con debilidad compartida) y tipos sin cobertura ofensiva eficaz.
   - Recomienda adiciones y reemplazos priorizando los Pokémon que el jugador tiene capturados en su PC/Caja. Si la PC está vacía, sugiere los mejores especímenes del metagame obtenibles en ese juego.
3. **Soporte Multigeneracional Universal y Hackroms:**
   - **Pokémon Platino Brillante (Luminescent Platinum):** Hackrom de BDSP con motor Gen 8, tabla moderna, tipo Hada, y dificultad competitiva.
   - **Pokémon Unbound:** Hackrom de GBA con mecánicas y movimientos hasta Gen 8, dificultad elevada y combates de estrategia.
   - **Pokémon Blanco 2:** Gen 5 (Teselia), 649 Pokémon, división físico/especial por movimiento, sin tipo Hada, Acero resiste Fantasma/Siniestro.
   - **Pokémon Y:** Gen 6 (Kalos), debut del tipo Hada, tabla de tipos moderna (Acero pierde resistencias a Fantasma y Siniestro), Megas.
   - **Pokémon Ultra Luna:** Gen 7 (Alola), movimientos Z, Hada, formas Alola.
   - Soporte heredado: Pokémon Esmeralda (Gen 3), Platino (Gen 4), HeartGold (Gen 4), Radical Red (Gen 8 hack).
4. **Builds Meta e Items Equipables Relevantes:**
   - Movimientos idóneos para la generación (con STAB, potencia, precisión, categoría correcta físico/especial).
   - Objetos clave (Restos, Vidasfera, Pañuelos/Cintas/Gafas Elección, Mineral Evolutivo, Banda Focus, Chaleco Asalto, etc.).
   - Naturalezas y distribución de EVs recomendadas con un consejo táctico (TIP) conciso en español.
5. **Rendimiento Ultra-Optimizado (Zero-Impact):**
   - Ejecución 100% síncrona en el cliente mediante diccionarios en memoria O(1).
   - Cero dependencias de red en runtime: funciona completamente offline mientras la consola ejecuta el emulador en la pantalla superior.
   - Consumo de memoria mínimo (<2 MB heap) y 0% de uso de CPU cuando no hay interacción activa.
   - Persistencia automática de Equipo y PC en `localStorage` individualizada por cartucho/juego.

---

## 2. Arquitectura del Sistema

### 2.1 Estructura de Módulos (`lib/dex/`)

```
lib/dex/
├── types.ts          # Definición de tipos, tabla de efectividades, multiplicadores por Gen (Gen 3 vs 4-5 vs 6+)
├── games.ts          # Catálogo de juegos/hackroms soportados con reglas de generación y acentos de color
├── moves.ts          # Diccionario de movimientos con categoría (físico/especial) adaptativa por Gen
├── items.ts          # Catálogo de objetos equipables competitivos y de historia
├── pokemon.ts        # Catálogo extendido de Pokémon con stats base, habilidades, builds meta y learnset
├── storage.ts        # Persistencia en localStorage por juego (team de 6 + Set de claves en PC)
└── analysis.ts       # Motor de sinergia de equipo, detección de amenazas y recomendador PC vs Wild
```

### 2.2 Reglas de Mecánicas por Generación

| Parámetro | Gen 3 (Esmeralda) | Gen 4-5 (Platino, HG, B2) | Gen 6-8 (Y, Ultra Luna, Platino Brillante, Unbound, Radical Red) |
|---|---|---|---|
| **Tipo Hada** | No existe | No existe | Activo (debilidades a Veneno/Acero; inmune a Dragón) |
| **Categoría Movimientos** | Derivada del Tipo (Físico/Especial) | Por Movimiento individual | Por Movimiento individual |
| **Acero vs Fantasma/Siniestro** | Resiste (0.5x) | Resiste (0.5x) | Daño Neutro (1.0x) |
| **Objetos Modernos** | Objetos clásicos Gen 3 | Mineral Evolutivo en Gen 5 | Chaleco Asalto, Seguro Debilidad, etc. |

---

## 3. Flujo de Datos y Componentes

### 3.1 Gestión de Equipo y PC en la UI (Preservando el 100% del Diseño)

1. **PartyDock (Dock inferior):**
   - Muestra los 6 slots activos del equipo.
   - Al tocar un slot con Pokémon, lo selecciona en la pantalla principal.
   - Al tocar un slot vacío, abre el buscador (`SearchDrawer`).
2. **RightDock (Dock derecho):**
   - El botón `EQUIPO / QUITAR` añade o retira el Pokémon actualmente seleccionado del equipo activo de 6.
3. **Registro de Pokémon en PC (Caja):**
   - En `ScanView`: Un botón/chip de estado `[+ PC]` / `[✓ EN PC]` integrado limpiamente en el encabezado de stats o panel de información sin romper ningún elemento del layout.
   - En `SearchDrawer`: Cada resultado en la lista muestra un indicador discreto si el Pokémon ya está en tu PC, y permite marcarlo con un toque prolongado o botón integrado.
4. **Motor de Recomendación en `PartyView`:**
   - La sección `Recomendación` de `PartyView` evalúa:
     $$\text{ThreatScore}(\text{tipo}) = 2 \times \text{débiles} - \text{resistencias}$$
   - Identifica tipos amenazantes no neutralizados y tipos a los que el equipo no puede infligir daño supereficaz.
   - Busca en el conjunto `PC` del jugador qué Pokémon disponibles:
     1. Resisten o anulan los tipos amenazantes del equipo.
     2. Poseen STAB o movimientos de cobertura eficaces contra los tipos objetivo.
     3. Tienen roles complementarios (ej. si el equipo carece de atacante especial o muralla).
   - Presenta la recomendación en formato:
     - `De tu PC: [Nombre] cubre [Tipo]`
     - Si la PC no tiene un candidato ideal: `Capturar: [Tipo] (Recomendado: [Pokémon Meta])`

---

## 4. Estrategia de Rendimiento y Memoria en AYN Thor

1. **Zero Runtime Fetches:** No se realizan peticiones HTTP para datos de juego. Todo el conocimiento de combate, builds y stats reside en objetos JavaScript inmutables estáticos.
2. **Lazy Assets:** Los sprites de iconos de caja e items se cargan bajo demanda con URLs validadas en CDN con caché de navegador permanente.
3. **Memoización Reactiva:** Las evaluaciones de debilidades de equipo (`teamSynergy`), filtrado de búsqueda y cálculo de recomendaciones se envuelven en `useMemo` con dependencias mínimas (`team`, `pcKeys`, `game.gen`).
4. **Evitar Re-renders Innecesarios:** Componentes de listas y tarjetas utilizan `key` estables basadas en el identificador único del Pokémon (`p.key`).

---

## 5. Manejo de Errores y Casos Borde

1. **Equipo Vacío:** `PartyView` muestra "EQUIPO VACÍO" y el recomendador invita a seleccionar Pokémon iniciales desde el buscador.
2. **PC Vacía:** Si el usuario no ha marcado ningún Pokémon en PC, el recomendador cae en modo "Captura Silvestre", sugiriendo los 3 mejores Pokémon meta del juego en curso para balancear el equipo.
3. **Migración / Incompatibilidad de Claves en LocalStorage:**
   - Validación segura de esquema en `localStorage`. Si un identificador de Pokémon o juego no existe en la versión actual, se limpia de forma transparente sin crashear la aplicación.
4. **Mecánicas Incompatibles con la Generación:**
   - Si un Pokémon tiene tipo Hada en generaciones posteriores pero se juega en Gen 5 o anterior, el motor asigna automáticamente su tipo clásico (ej. Gardevoir: Psíquico puro en Gen 3-5, Psíquico/Hada en Gen 6+).
   - Movimientos del tipo Hada o items que no existían en esa generación se etiquetan visualmente como no disponibles o se adaptan a la build legal más óptima de esa época.

---

## 6. Plan de Validación y Pruebas

1. **Validación de Compilación y Tipado:** `npm run build` debe compilar en TypeScript estricto con cero errores.
2. **Prueba de Cartuchos y Generaciones:**
   - Alternar entre *Pokémon Platino Brillante*, *Pokémon Unbound*, *Pokémon Blanco 2*, *Pokémon Y* y *Pokémon Ultra Luna*.
   - Verificar que la tabla de debilidades y el indicador de generación en el TopBar reflejen las mecánicas de cada uno.
3. **Prueba de Sinergia y Recomendación de PC:**
   - Crear un equipo con debilidad a Tierra (ej. Lucario, Tyranitar).
   - Marcar en PC a Rotom-Wash o Garchomp.
   - Confirmar que la pantalla de Sinergia priorice recomendar a Rotom-Wash por su inmunidad a Tierra.
4. **Verificación de UI y Proporción:**
   - Validar en el navegador que el viewport respete la proporción `31/27`, encaje sin scrollbar global y mantenga el estilo visual intacto.
