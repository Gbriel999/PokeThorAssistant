<div align="center">

# ⚡ PokeThorAssistant ⚡
### Tactical Pokédex & Real-Time Battle Scout for AYN Thor & Dual-Screen Handhelds

<br />

<img src="./assets/cover.jpg" alt="PokeThorAssistant Cover" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" />

<br /><br />

[![Latest APK Release](https://img.shields.io/github/v/release/Gbriel999/PokeThorAssistant?style=for-the-badge&color=00e5ff&label=APK%20Release)](https://github.com/Gbriel999/PokeThorAssistant/releases/latest)
[![Platform](https://img.shields.io/badge/Platform-AYN%20Thor%20%7C%20Android%20%7C%20Web-ff0055?style=for-the-badge)](https://github.com/Gbriel999/PokeThorAssistant)
[![Offline Database](https://img.shields.io/badge/Offline%20Database-1025%20Pok%C3%A9mon-39ff14?style=for-the-badge)](https://github.com/Gbriel999/PokeThorAssistant)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br />

**PokeThorAssistant** es la herramienta táctica definitiva diseñada específicamente para la pantalla inferior de la consola **AYN Thor** y dispositivos Android con formato dual-screen / emulación (Citra, MelonDS, DraStic, RetroArch, etc.). Permite consultar debilidades, calcular sinergias competitivas y recibir asesoría de combate en tiempo real mientras juegas en la pantalla superior.

</div>

---

## 🚀 Descarga el APK

Puedes descargar la última versión compilada lista para instalar en tu AYN Thor o cualquier dispositivo Android:

👉 **[Descargar PokeThorAssistant.apk (v1.0.0)](https://github.com/Gbriel999/PokeThorAssistant/releases/latest/download/PokeThorAssistant.apk)**

---

## 🌟 Características Principales

### ⚔️ 1. Asesor Táctico de Combate (VS RIVAL)
¿El rival sacó un Pokémon desconocido y no sabes con qué responder?
- **Puntuación de 1 a 5 Estrellas (`★★★★★`)**: Evalúa automáticamente qué Pokémon de tu equipo activo tiene la ventaja táctica frente al rival.
- **Detección de Inmunidades por Habilidad**: Reconoce inmunidades clave como *Levitate* (Tierra), *Flash Fire* (Fuego), *Water Absorb* / *Storm Drain* (Agua) y *Volt Absorb* / *Motor Drive* (Eléctrico).
- **Alertas de Peligro & STAB**: Advierte si el rival te supera en velocidad (`Speed Tier`), si tus ataques no le hacen daño o si puede noquearte con ataques STAB supereficaces.
- **Banca / PC Box Compacta**: Sugerencias secundarias de tu reserva para saber a quién rotar a tu equipo si la situación lo amerita.

### 📖 2. Base de Datos Offline de 1025 Pokémon (Gen 1 - Gen 9)
- **100% Offline**: Todo el motor de cálculo y estadísticas funciona sin conexión a internet.
- **Modelos 3D y Sprites Showdown**: Sprites animados para todas las especies y formas regionales (Galar, Alola, Hisui, Paldea).
- **Buscador con Filtros por Generación**: Filtrado instantáneo por generaciones con insignias icónicas de cada región (Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Paldea).

### 🎮 3. Selector de Cartuchos & ROM Hacks Populares
Adapta las mecánicas, tipos y movimientos al juego exacto que estés jugando:
- **ROM Hacks Populares**: Radical Red, Emerald Rogue, Inclement Emerald, Pokémon Unbound, Renegade Platinum, Luminescent Platinum.
- **Juegos Clásicos Organizados por Consola**:
  - **GBA**: FireRed / LeafGreen, Emerald, Ruby / Sapphire.
  - **NDS**: HeartGold / SoulSilver, Platinum, Black / White, Black 2 / White 2.
  - **3DS**: X / Y, Omega Ruby / Alpha Sapphire, Sun / Moon, Ultra Sun / Ultra Moon.
  - **Switch**: Sword / Shield, Scarlet / Violet.
- Barra de búsqueda y pestañas de filtrado rápido por consola.

### 💾 4. Gestor Multi-Equipos por ROM Hack / Partida
- Crea y administra múltiples equipos para tus diferentes partidas y juegos.
- Renombra tus equipos (ej. *"Radical Red - Hardcore"*, *"Emerald Rogue Nuzlocke"*, *"VGC Series"*).
- Agrega, reemplaza y elimina slots con un solo toque.
- Persistencia local automática en el almacenamiento de tu consola.

### 📊 5. Personalización Competitiva de IVs, EVs & Naturalezas
- **Editor Completo**: Ajusta IVs (0–31), EVs (0–252) y Naturalezas (+10% / -10% en estadísticas reales).
- **Arquetipos Competitivos Predefinidos**: Carga con un click builds balanceadas de Smogon/VGC adaptadas al rol del Pokémon:
  - *Defensive Wall* (252 HP / 252 Def)
  - *Special Wall* (252 HP / 252 SpD)
  - *Physical Sweeper* (252 Atk / 252 Spe)
  - *Special Sweeper* (252 SpA / 252 Spe)
  - *Bulky Offense* (252 HP / 252 Atk o SpA)

---

## 📱 Instalación en AYN Thor / Android

1. Descarga el archivo **`PokeThorAssistant.apk`** desde la sección de [Releases](https://github.com/Gbriel999/PokeThorAssistant/releases/latest).
2. En tu AYN Thor, abre el explorador de archivos y pulsa sobre el APK descargado.
3. Si el sistema te lo solicita, activa la opción **"Permitir la instalación de fuentes desconocidas"**.
4. Pulsa en **Instalar**.
5. ¡Listo! Abre **PokeThorAssistant** en la pantalla inferior táctil de tu AYN Thor mientras ejecutas tu emulador preferido en la pantalla principal.

---

## 💻 Ejecución en Desarrollo (Web / PC)

Si prefieres usar la herramienta en PC o compilarla tú mismo:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Gbriel999/PokeThorAssistant.git
cd PokeThorAssistant

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar APK localmente:
```bash
# Generar build estático y sincronizar con Capacitor Android
npm run cap:sync

# Compilar el APK con Gradle
cd android
./gradlew assembleDebug
```
El archivo APK resultante se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Static Export)
- **UI & Estilos**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Motor Pokémon**: [@pkmn/dex](https://github.com/pkmn/ps)
- **Runtime Nativo Android**: [Capacitor 8](https://capacitorjs.com/)

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE). Pokémon y los nombres de los personajes son marcas registradas de Nintendo, Creatures Inc. y Game Freak. PokeThorAssistant es una herramienta sin fines de lucro creada por y para la comunidad.
