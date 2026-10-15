<div align="center">

# PokeThorAssistant
### Tactical Pokédex & Real-Time Battle Scout for AYN Thor & Dual-Screen Handhelds

<br />

<img src="./assets/cover.jpg" alt="PokeThorAssistant Cover" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" />

<br /><br />

[![Latest APK Release](https://img.shields.io/github/v/release/Gbriel999/PokeThorAssistant?style=for-the-badge&color=00e5ff&label=APK%20Release)](https://github.com/Gbriel999/PokeThorAssistant/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-AYN%20Thor%20%7C%20Android%20%7C%20Web-ff0055?style=for-the-badge)](https://github.com/Gbriel999/PokeThorAssistant)
[![Offline Database](https://img.shields.io/badge/Offline%20Database-1025%20Pok%C3%A9mon-39ff14?style=for-the-badge)](https://github.com/Gbriel999/PokeThorAssistant)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br />

**PokeThorAssistant** es una herramienta táctica diseñada para la pantalla inferior de la consola **AYN Thor** y dispositivos Android con formato de doble pantalla o emulación (Citra, MelonDS, DraStic, RetroArch). Permite analizar debilidades, calcular sinergias competitivas y recibir recomendaciones de combate en tiempo real mientras juegas en la pantalla superior.

</div>

---

## Descarga del APK

La versión compilada lista para instalar en consolas AYN Thor y dispositivos Android se encuentra disponible en releases:

- **[Descargar PokeThorAssistant.apk (v1.0.0)](https://github.com/Gbriel999/PokeThorAssistant/releases/latest/download/PokeThorAssistant.apk)**

---

## Características Principales

### 1. Asesor Táctico de Combate (VS RIVAL)
Diseñado para situaciones donde el rival lanza un Pokémon desconocido:
- **Calificación Táctica (1 a 5 estrellas)**: Clasifica cada miembro de tu equipo frente al rival según ventaja de tipo, daño potencial y velocidad relativa.
- **Detección de Inmunidades por Habilidad**: Reconoce inmunidades clave como Levitate, Flash Fire, Water Absorb, Storm Drain, Volt Absorb y Motor Drive.
- **Alertas de Peligro y STAB**: Identifica desventajas de velocidad (Speed Tiers), ataques sin efecto e impacto de ataques STAB supereficaces del oponente.
- **Recomendaciones de PC Box**: Muestra opciones secundarias de reserva en formato compacto para evaluar rotaciones de equipo.

### 2. Base de Datos Offline de 1025 Pokémon (Gen 1 - Gen 9)
- **Completamente Offline**: Motor de cálculo, base de datos de especies, movimientos y tablas de tipos sin requerir conexión a internet.
- **Modelos 3D y Sprites Showdown**: Sprites animados para todas las especies y formas regionales (Galar, Alola, Hisui, Paldea).
- **Filtros por Generación**: Navegación rápida por generaciones con identificador regional (Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Paldea).

### 3. Soporte para 17+ Cartuchos y ROM Hacks
Ajusta la generación, mecánicas y lista de movimientos al juego activo:
- **ROM Hacks Populares**: Radical Red, Emerald Rogue, Inclement Emerald, Pokémon Unbound, Renegade Platinum, Luminescent Platinum.
- **Clásicos por Plataforma**:
  - **GBA**: FireRed / LeafGreen, Emerald, Ruby / Sapphire.
  - **NDS**: HeartGold / SoulSilver, Platinum, Black / White, Black 2 / White 2.
  - **3DS**: X / Y, Omega Ruby / Alpha Sapphire, Sun / Moon, Ultra Sun / Ultra Moon.
  - **Switch**: Sword / Shield, Scarlet / Violet.
- Filtros por consola y buscador integrado en el selector de cartucho.

### 4. Gestor Multi-Equipos por ROM Hack y Partida
- Creación y administración de múltiples alineaciones independientes para diferentes partidas.
- Opciones para renombrar, agregar, reemplazar y eliminar perfiles de equipo.
- Persistencia automática en el almacenamiento local del dispositivo.

### 5. Editor Competitivo de IVs, EVs y Naturalezas
- **Ajuste Manual**: Configuración precisa de IVs (0 a 31), EVs (0 a 252) y Naturalezas con recálculo exacto de estadísticas.
- **Arquetipos Competitivos**: Perfiles predefinidos según el rol competitivo:
  - Defensive Wall (252 HP / 252 Def)
  - Special Wall (252 HP / 252 SpD)
  - Physical Sweeper (252 Atk / 252 Spe)
  - Special Sweeper (252 SpA / 252 Spe)
  - Bulky Offense (252 HP / 252 Atk o SpA)

---

## Instalación en AYN Thor / Android

1. Descarga el archivo `PokeThorAssistant.apk` desde [Releases](https://github.com/Gbriel999/PokeThorAssistant/releases/latest).
2. En tu consola o dispositivo Android, abre el archivo descargado.
3. Si el sistema lo solicita, habilita la opción de instalar aplicaciones desde fuentes desconocidas.
4. Completa la instalación y ejecuta la aplicación en la pantalla inferior o en modo pantalla dividida.

---

## Entorno de Desarrollo (Web / PC)

Para ejecutar la aplicación localmente en un navegador:

```bash
# Clonar el repositorio
git clone https://github.com/Gbriel999/PokeThorAssistant.git
cd PokeThorAssistant

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### Compilación del APK

```bash
# Generar build estático y sincronizar plataforma Android
npm run cap:sync

# Compilar el binario APK con Gradle
cd android
./gradlew assembleDebug
```

El binario compilado se ubica en: `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router, Turbopack, Static Export)
- **Interfaz**: React 19, Tailwind CSS v4, Lucide Icons
- **Motor de Datos**: @pkmn/dex
- **Contenedor Android**: Capacitor 8

---

## Licencia

Distribuido bajo licencia [MIT](LICENSE). Pokémon y los nombres de personajes y criaturas son marcas registradas de Nintendo, Creatures Inc. y Game Freak. Este proyecto es una herramienta independiente y sin fines de lucro.
