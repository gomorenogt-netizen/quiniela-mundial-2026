import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// CONSTANTS & CONFIG
// ============================================================
const INVITE_CODE = "Mundi@l2026$!";
const ADMIN_CODE = "admin2026";

const PHASES = {
  grupos:  { label: "Fase de Grupos",   multiplier: 1,  emoji: "🌍", color: "emerald" },
  octavos: { label: "Octavos de Final", multiplier: 2,  emoji: "⚡", color: "sky"     },
  cuartos: { label: "Cuartos de Final", multiplier: 3,  emoji: "🔥", color: "orange"  },
  semis:   { label: "Semifinales",      multiplier: 5,  emoji: "💎", color: "violet"  },
  final:   { label: "Gran Final",       multiplier: 10, emoji: "👑", color: "amber"   },
};

const SCORING = { resultado: 3, diferencia: 3, marcadorExacto: 4, campeon: 25, subcampeon: 15, goleador: 20 };

const AVATAR_EMOJIS = [
  "🦁","🦊","🐯","🦅","🐺","🦋","🐸","🦄","🐲","🐬",
  "🦈","🦉","🦚","🦜","🐻","🐼","🦏","🦬","🦝","🦡"
];

// ══════════════════════════════════════════════════════════════
// OFFICIAL FIFA WORLD CUP 2026 — COMPLETE VERIFIED DATA
// Source: Official FIFA fixture (full schedule confirmed)
// Times: Eastern US (ET). CDMX = ET-2. Arg = ET+1. España = ET+6
// ══════════════════════════════════════════════════════════════

const TEAMS = [
  "México","Sudáfrica","Corea del Sur","Rep. Checa",
  "Canadá","Bosnia y Herzegovina","Qatar","Suiza",
  "Brasil","Marruecos","Haití","Escocia",
  "EEUU","Paraguay","Australia","Turquía",
  "Alemania","Curazao","Costa de Marfil","Ecuador",
  "Países Bajos","Japón","Suecia","Túnez",
  "Bélgica","Egipto","Irán","Nueva Zelanda",
  "España","Cabo Verde","Arabia Saudita","Uruguay",
  "Francia","Senegal","Irak","Noruega",
  "Argentina","Argelia","Austria","Jordania",
  "Portugal","RD Congo","Uzbekistán","Colombia",
  "Inglaterra","Croacia","Ghana","Panamá",
];

const PLAYERS = [
  "Kylian Mbappé","Erling Haaland","Vinicius Jr","Harry Kane","Lionel Messi",
  "Cristiano Ronaldo","Lamine Yamal","Jude Bellingham","Bukayo Saka","Phil Foden",
  "Mohamed Salah","Jamal Musiala","Florian Wirtz","Michael Olise","Rodrygo",
  "Raphinha","Endrick","Marcus Rashford","Alexander Isak","Viktor Gyökeres",
  "Julián Álvarez","Lautaro Martínez","Darwin Núñez","Son Heung-min","Cody Gakpo",
  "Memphis Depay","Antoine Griezmann","Ousmane Dembélé","Marcus Thuram","Randal Kolo Muani",
  "Kai Havertz","Niclas Füllkrug","Leroy Sané","Kevin De Bruyne","Romelu Lukaku",
  "Jeremy Doku","Leandro Trossard","Álvaro Morata","Dani Olmo","Nico Williams",
  "Pedri","Gavi","Luis Díaz","Jhon Durán","James Rodríguez",
  "Rafael Leão","Bruno Fernandes","Bernardo Silva","Diogo Jota","Gonçalo Ramos",
  "João Félix","Christian Pulisic","Timothy Weah","Folarin Balogun","Alphonso Davies",
  "Jonathan David","Hirving Lozano","Santiago Giménez","Raúl Jiménez","Sadio Mané",
  "Ismaïla Sarr","Youssef En-Nesyri","Hakim Ziyech","Achraf Hakimi","Arda Güler",
  "Hakan Çalhanoğlu","Barış Alper Yılmaz","Kerem Aktürkoğlu","Enner Valencia","Moisés Caicedo",
  "Federico Valverde","Takefusa Kubo","Takumi Minamino","Kaoru Mitoma","Breel Embolo",
  "Xherdan Shaqiri","Granit Xhaka","Patrik Schick","Tomáš Souček","Andrej Kramarić",
  "Ivan Perišić","Mohammed Kudus","Thomas Partey","Inaki Williams","Sardar Azmoun",
  "Mehdi Taremi","Salem Al-Dawsari","Chris Wood","Hwang Hee-chan","Benjamin Šeško",
  "Marcel Sabitzer","Marko Arnautović","Riyad Mahrez","Alejandro Garnacho","Richarlison",
  "Duván Zapata","Miguel Almirón","Edin Džeko","John McGinn","Che Adams",
];

// Mapa de estadios → ciudad legible
const VENUE_NAMES = {
  "Ciudad de México": "Est. Ciudad de México",
  "Guadalajara":      "Est. Guadalajara",
  "Monterrey":        "Est. Monterrey (BBVA)",
  "Toronto":          "Est. Toronto (BMO)",
  "Vancouver":        "Est. BC Place, Vancouver",
  "Nueva York":       "MetLife Stadium, NJ",
  "Boston":           "Gillette Stadium, Foxborough",
  "Filadelfia":       "Lincoln Financial, Philadelphia",
  "Atlanta":          "Mercedes-Benz Stadium, Atlanta",
  "Miami":            "Hard Rock Stadium, Miami",
  "Houston":          "NRG Stadium, Houston",
  "Dallas":           "AT&T Stadium, Arlington",
  "Kansas City":      "Arrowhead Stadium, KC",
  "Los Ángeles":      "SoFi Stadium, Los Ángeles",
  "Seattle":          "Lumen Field, Seattle",
  "San Francisco":    "Levi's Stadium, Santa Clara",
};

const SEED_MATCHES = [

  // ════════════════════════════════════════════════════════
  // JORNADA 1  —  11 al 17 de junio 2026
  // ════════════════════════════════════════════════════════

  // Jueves 11 jun
  { id:1,  group:"A", phase:"grupos", home:"México",          homeFlag:"🇲🇽", away:"Sudáfrica",          awayFlag:"🇿🇦", date:"2026-06-11", time:"15:00", venue:"Est. Ciudad de México" },
  { id:2,  group:"A", phase:"grupos", home:"Corea del Sur",   homeFlag:"🇰🇷", away:"Rep. Checa",          awayFlag:"🇨🇿", date:"2026-06-11", time:"22:00", venue:"Est. Guadalajara" },

  // Viernes 12 jun
  { id:3,  group:"B", phase:"grupos", home:"Canadá",          homeFlag:"🇨🇦", away:"Bosnia y Herz.",      awayFlag:"🇧🇦", date:"2026-06-12", time:"15:00", venue:"Est. Toronto (BMO)" },
  { id:4,  group:"D", phase:"grupos", home:"EEUU",            homeFlag:"🇺🇸", away:"Paraguay",            awayFlag:"🇵🇾", date:"2026-06-12", time:"21:00", venue:"SoFi Stadium, Los Ángeles" },

  // Sábado 13 jun
  { id:5,  group:"B", phase:"grupos", home:"Qatar",           homeFlag:"🇶🇦", away:"Suiza",               awayFlag:"🇨🇭", date:"2026-06-13", time:"15:00", venue:"Levi's Stadium, Santa Clara" },
  { id:6,  group:"C", phase:"grupos", home:"Brasil",          homeFlag:"🇧🇷", away:"Marruecos",           awayFlag:"🇲🇦", date:"2026-06-13", time:"18:00", venue:"MetLife Stadium, NJ" },
  { id:7,  group:"C", phase:"grupos", home:"Haití",           homeFlag:"🇭🇹", away:"Escocia",             awayFlag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", date:"2026-06-13", time:"21:00", venue:"Gillette Stadium, Foxborough" },
  { id:8,  group:"D", phase:"grupos", home:"Australia",       homeFlag:"🇦🇺", away:"Turquía",             awayFlag:"🇹🇷", date:"2026-06-14", time:"00:00", venue:"Est. BC Place, Vancouver" },

  // Domingo 14 jun
  { id:9,  group:"E", phase:"grupos", home:"Alemania",        homeFlag:"🇩🇪", away:"Curazao",             awayFlag:"🇨🇼", date:"2026-06-14", time:"13:00", venue:"NRG Stadium, Houston" },
  { id:10, group:"F", phase:"grupos", home:"Países Bajos",    homeFlag:"🇳🇱", away:"Japón",               awayFlag:"🇯🇵", date:"2026-06-14", time:"16:00", venue:"AT&T Stadium, Arlington" },
  { id:11, group:"E", phase:"grupos", home:"Costa de Marfil", homeFlag:"🇨🇮", away:"Ecuador",             awayFlag:"🇪🇨", date:"2026-06-14", time:"19:00", venue:"Lincoln Financial, Philadelphia" },
  { id:12, group:"F", phase:"grupos", home:"Suecia",          homeFlag:"🇸🇪", away:"Túnez",               awayFlag:"🇹🇳", date:"2026-06-14", time:"22:00", venue:"Est. Monterrey (BBVA)" },

  // Lunes 15 jun
  { id:13, group:"H", phase:"grupos", home:"España",          homeFlag:"🇪🇸", away:"Cabo Verde",          awayFlag:"🇨🇻", date:"2026-06-15", time:"12:00", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:14, group:"G", phase:"grupos", home:"Bélgica",         homeFlag:"🇧🇪", away:"Egipto",              awayFlag:"🇪🇬", date:"2026-06-15", time:"15:00", venue:"Lumen Field, Seattle" },
  { id:15, group:"H", phase:"grupos", home:"Arabia Saudita",  homeFlag:"🇸🇦", away:"Uruguay",             awayFlag:"🇺🇾", date:"2026-06-15", time:"18:00", venue:"Hard Rock Stadium, Miami" },
  { id:16, group:"G", phase:"grupos", home:"Irán",            homeFlag:"🇮🇷", away:"Nueva Zelanda",       awayFlag:"🇳🇿", date:"2026-06-15", time:"21:00", venue:"SoFi Stadium, Los Ángeles" },

  // Martes 16 jun
  { id:17, group:"I", phase:"grupos", home:"Francia",         homeFlag:"🇫🇷", away:"Senegal",             awayFlag:"🇸🇳", date:"2026-06-16", time:"15:00", venue:"MetLife Stadium, NJ" },
  { id:18, group:"I", phase:"grupos", home:"Irak",            homeFlag:"🇮🇶", away:"Noruega",             awayFlag:"🇳🇴", date:"2026-06-16", time:"18:00", venue:"Gillette Stadium, Foxborough" },
  { id:19, group:"J", phase:"grupos", home:"Argentina",       homeFlag:"🇦🇷", away:"Argelia",             awayFlag:"🇩🇿", date:"2026-06-16", time:"21:00", venue:"Arrowhead Stadium, KC" },
  { id:20, group:"J", phase:"grupos", home:"Austria",         homeFlag:"🇦🇹", away:"Jordania",            awayFlag:"🇯🇴", date:"2026-06-17", time:"00:00", venue:"Levi's Stadium, Santa Clara" },

  // Miércoles 17 jun
  { id:21, group:"K", phase:"grupos", home:"Portugal",        homeFlag:"🇵🇹", away:"RD Congo",            awayFlag:"🇨🇩", date:"2026-06-17", time:"13:00", venue:"NRG Stadium, Houston" },
  { id:22, group:"L", phase:"grupos", home:"Inglaterra",      homeFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", away:"Croacia",             awayFlag:"🇭🇷", date:"2026-06-17", time:"16:00", venue:"AT&T Stadium, Arlington" },
  { id:23, group:"L", phase:"grupos", home:"Ghana",           homeFlag:"🇬🇭", away:"Panamá",              awayFlag:"🇵🇦", date:"2026-06-17", time:"19:00", venue:"Est. Toronto (BMO)" },
  { id:24, group:"K", phase:"grupos", home:"Uzbekistán",      homeFlag:"🇺🇿", away:"Colombia",            awayFlag:"🇨🇴", date:"2026-06-17", time:"22:00", venue:"Est. Ciudad de México" },

  // ════════════════════════════════════════════════════════
  // JORNADA 2  —  18 al 24 de junio 2026
  // ════════════════════════════════════════════════════════

  // Jueves 18 jun
  { id:25, group:"A", phase:"grupos", home:"Rep. Checa",      homeFlag:"🇨🇿", away:"Sudáfrica",           awayFlag:"🇿🇦", date:"2026-06-18", time:"12:00", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:26, group:"B", phase:"grupos", home:"Suiza",           homeFlag:"🇨🇭", away:"Bosnia y Herz.",      awayFlag:"🇧🇦", date:"2026-06-18", time:"15:00", venue:"SoFi Stadium, Los Ángeles" },
  { id:27, group:"B", phase:"grupos", home:"Canadá",          homeFlag:"🇨🇦", away:"Qatar",               awayFlag:"🇶🇦", date:"2026-06-18", time:"18:00", venue:"Est. BC Place, Vancouver" },
  { id:28, group:"A", phase:"grupos", home:"México",          homeFlag:"🇲🇽", away:"Corea del Sur",       awayFlag:"🇰🇷", date:"2026-06-18", time:"21:00", venue:"Est. Guadalajara" },

  // Viernes 19 jun
  { id:29, group:"D", phase:"grupos", home:"EEUU",            homeFlag:"🇺🇸", away:"Australia",           awayFlag:"🇦🇺", date:"2026-06-19", time:"15:00", venue:"Lumen Field, Seattle" },
  { id:30, group:"C", phase:"grupos", home:"Escocia",         homeFlag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", away:"Marruecos",           awayFlag:"🇲🇦", date:"2026-06-19", time:"18:00", venue:"Gillette Stadium, Foxborough" },
  { id:31, group:"C", phase:"grupos", home:"Brasil",          homeFlag:"🇧🇷", away:"Haití",               awayFlag:"🇭🇹", date:"2026-06-19", time:"21:00", venue:"Lincoln Financial, Philadelphia" },
  { id:32, group:"D", phase:"grupos", home:"Turquía",         homeFlag:"🇹🇷", away:"Paraguay",            awayFlag:"🇵🇾", date:"2026-06-20", time:"00:00", venue:"Levi's Stadium, Santa Clara" },

  // Sábado 20 jun
  { id:33, group:"F", phase:"grupos", home:"Países Bajos",    homeFlag:"🇳🇱", away:"Suecia",              awayFlag:"🇸🇪", date:"2026-06-20", time:"13:00", venue:"NRG Stadium, Houston" },
  { id:34, group:"E", phase:"grupos", home:"Alemania",        homeFlag:"🇩🇪", away:"Costa de Marfil",     awayFlag:"🇨🇮", date:"2026-06-20", time:"16:00", venue:"Est. Toronto (BMO)" },
  { id:35, group:"E", phase:"grupos", home:"Ecuador",         homeFlag:"🇪🇨", away:"Curazao",             awayFlag:"🇨🇼", date:"2026-06-20", time:"22:00", venue:"Arrowhead Stadium, KC" },
  { id:36, group:"F", phase:"grupos", home:"Túnez",           homeFlag:"🇹🇳", away:"Japón",               awayFlag:"🇯🇵", date:"2026-06-21", time:"00:00", venue:"Est. Monterrey (BBVA)" },

  // Domingo 21 jun
  { id:37, group:"H", phase:"grupos", home:"España",          homeFlag:"🇪🇸", away:"Arabia Saudita",      awayFlag:"🇸🇦", date:"2026-06-21", time:"12:00", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:38, group:"G", phase:"grupos", home:"Bélgica",         homeFlag:"🇧🇪", away:"Irán",                awayFlag:"🇮🇷", date:"2026-06-21", time:"15:00", venue:"SoFi Stadium, Los Ángeles" },
  { id:39, group:"H", phase:"grupos", home:"Uruguay",         homeFlag:"🇺🇾", away:"Cabo Verde",          awayFlag:"🇨🇻", date:"2026-06-21", time:"18:00", venue:"Hard Rock Stadium, Miami" },
  { id:40, group:"G", phase:"grupos", home:"Nueva Zelanda",   homeFlag:"🇳🇿", away:"Egipto",              awayFlag:"🇪🇬", date:"2026-06-21", time:"21:00", venue:"Est. BC Place, Vancouver" },

  // Lunes 22 jun
  { id:41, group:"J", phase:"grupos", home:"Argentina",       homeFlag:"🇦🇷", away:"Austria",             awayFlag:"🇦🇹", date:"2026-06-22", time:"13:00", venue:"AT&T Stadium, Arlington" },
  { id:42, group:"I", phase:"grupos", home:"Francia",         homeFlag:"🇫🇷", away:"Irak",                awayFlag:"🇮🇶", date:"2026-06-22", time:"17:00", venue:"Lincoln Financial, Philadelphia" },
  { id:43, group:"I", phase:"grupos", home:"Noruega",         homeFlag:"🇳🇴", away:"Senegal",             awayFlag:"🇸🇳", date:"2026-06-22", time:"20:00", venue:"MetLife Stadium, NJ" },
  { id:44, group:"J", phase:"grupos", home:"Jordania",        homeFlag:"🇯🇴", away:"Argelia",             awayFlag:"🇩🇿", date:"2026-06-23", time:"23:00", venue:"Levi's Stadium, Santa Clara" },

  // Martes 23 jun
  { id:45, group:"K", phase:"grupos", home:"Portugal",        homeFlag:"🇵🇹", away:"Uzbekistán",          awayFlag:"🇺🇿", date:"2026-06-23", time:"13:00", venue:"NRG Stadium, Houston" },
  { id:46, group:"L", phase:"grupos", home:"Inglaterra",      homeFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", away:"Ghana",               awayFlag:"🇬🇭", date:"2026-06-23", time:"16:00", venue:"Gillette Stadium, Foxborough" },
  { id:47, group:"L", phase:"grupos", home:"Panamá",          homeFlag:"🇵🇦", away:"Croacia",             awayFlag:"🇭🇷", date:"2026-06-23", time:"19:00", venue:"Est. Toronto (BMO)" },
  { id:48, group:"K", phase:"grupos", home:"Colombia",        homeFlag:"🇨🇴", away:"RD Congo",            awayFlag:"🇨🇩", date:"2026-06-23", time:"22:00", venue:"Est. Guadalajara" },

  // ════════════════════════════════════════════════════════
  // JORNADA 3 — 24 al 27 de junio 2026 (simultáneos por grupo)
  // ════════════════════════════════════════════════════════

  // Miércoles 24 jun — Grupos A y C (simultáneos)
  { id:49, group:"B", phase:"grupos", home:"Suiza",           homeFlag:"🇨🇭", away:"Canadá",              awayFlag:"🇨🇦", date:"2026-06-24", time:"15:00", venue:"Est. BC Place, Vancouver" },
  { id:50, group:"B", phase:"grupos", home:"Bosnia y Herz.",  homeFlag:"🇧🇦", away:"Qatar",               awayFlag:"🇶🇦", date:"2026-06-24", time:"15:00", venue:"Lumen Field, Seattle" },
  { id:51, group:"C", phase:"grupos", home:"Escocia",         homeFlag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", away:"Brasil",              awayFlag:"🇧🇷", date:"2026-06-24", time:"18:00", venue:"Hard Rock Stadium, Miami" },
  { id:52, group:"C", phase:"grupos", home:"Marruecos",       homeFlag:"🇲🇦", away:"Haití",               awayFlag:"🇭🇹", date:"2026-06-24", time:"18:00", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:53, group:"A", phase:"grupos", home:"Rep. Checa",      homeFlag:"🇨🇿", away:"México",              awayFlag:"🇲🇽", date:"2026-06-24", time:"21:00", venue:"Est. Ciudad de México" },
  { id:54, group:"A", phase:"grupos", home:"Sudáfrica",       homeFlag:"🇿🇦", away:"Corea del Sur",       awayFlag:"🇰🇷", date:"2026-06-24", time:"21:00", venue:"Est. Monterrey (BBVA)" },

  // Jueves 25 jun — Grupos D y F (simultáneos)
  { id:55, group:"E", phase:"grupos", home:"Curazao",         homeFlag:"🇨🇼", away:"Costa de Marfil",     awayFlag:"🇨🇮", date:"2026-06-25", time:"16:00", venue:"Lincoln Financial, Philadelphia" },
  { id:56, group:"E", phase:"grupos", home:"Ecuador",         homeFlag:"🇪🇨", away:"Alemania",            awayFlag:"🇩🇪", date:"2026-06-25", time:"16:00", venue:"MetLife Stadium, NJ" },
  { id:57, group:"F", phase:"grupos", home:"Japón",           homeFlag:"🇯🇵", away:"Suecia",              awayFlag:"🇸🇪", date:"2026-06-25", time:"19:00", venue:"AT&T Stadium, Arlington" },
  { id:58, group:"F", phase:"grupos", home:"Túnez",           homeFlag:"🇹🇳", away:"Países Bajos",        awayFlag:"🇳🇱", date:"2026-06-25", time:"19:00", venue:"Arrowhead Stadium, KC" },
  { id:59, group:"D", phase:"grupos", home:"Turquía",         homeFlag:"🇹🇷", away:"EEUU",                awayFlag:"🇺🇸", date:"2026-06-25", time:"22:00", venue:"SoFi Stadium, Los Ángeles" },
  { id:60, group:"D", phase:"grupos", home:"Paraguay",        homeFlag:"🇵🇾", away:"Australia",           awayFlag:"🇦🇺", date:"2026-06-25", time:"22:00", venue:"Levi's Stadium, Santa Clara" },

  // Viernes 26 jun — Grupos H e I (simultáneos)
  { id:61, group:"I", phase:"grupos", home:"Noruega",         homeFlag:"🇳🇴", away:"Francia",             awayFlag:"🇫🇷", date:"2026-06-26", time:"15:00", venue:"Gillette Stadium, Foxborough" },
  { id:62, group:"I", phase:"grupos", home:"Senegal",         homeFlag:"🇸🇳", away:"Irak",                awayFlag:"🇮🇶", date:"2026-06-26", time:"15:00", venue:"Est. Toronto (BMO)" },
  { id:63, group:"H", phase:"grupos", home:"Cabo Verde",      homeFlag:"🇨🇻", away:"Arabia Saudita",      awayFlag:"🇸🇦", date:"2026-06-26", time:"20:00", venue:"NRG Stadium, Houston" },
  { id:64, group:"H", phase:"grupos", home:"Uruguay",         homeFlag:"🇺🇾", away:"España",              awayFlag:"🇪🇸", date:"2026-06-26", time:"20:00", venue:"Est. Guadalajara" },
  { id:65, group:"G", phase:"grupos", home:"Egipto",          homeFlag:"🇪🇬", away:"Irán",                awayFlag:"🇮🇷", date:"2026-06-26", time:"23:00", venue:"Lumen Field, Seattle" },
  { id:66, group:"G", phase:"grupos", home:"Nueva Zelanda",   homeFlag:"🇳🇿", away:"Bélgica",             awayFlag:"🇧🇪", date:"2026-06-26", time:"23:00", venue:"Est. BC Place, Vancouver" },

  // Sábado 27 jun — Grupos J, K y L (simultáneos)
  { id:67, group:"L", phase:"grupos", home:"Panamá",          homeFlag:"🇵🇦", away:"Inglaterra",          awayFlag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", date:"2026-06-27", time:"17:00", venue:"MetLife Stadium, NJ" },
  { id:68, group:"L", phase:"grupos", home:"Croacia",         homeFlag:"🇭🇷", away:"Ghana",               awayFlag:"🇬🇭", date:"2026-06-27", time:"17:00", venue:"Lincoln Financial, Philadelphia" },
  { id:69, group:"K", phase:"grupos", home:"Colombia",        homeFlag:"🇨🇴", away:"Portugal",            awayFlag:"🇵🇹", date:"2026-06-27", time:"19:30", venue:"Hard Rock Stadium, Miami" },
  { id:70, group:"K", phase:"grupos", home:"RD Congo",        homeFlag:"🇨🇩", away:"Uzbekistán",          awayFlag:"🇺🇿", date:"2026-06-27", time:"19:30", venue:"Mercedes-Benz Stadium, Atlanta" },
  { id:71, group:"J", phase:"grupos", home:"Argelia",         homeFlag:"🇩🇿", away:"Austria",             awayFlag:"🇦🇹", date:"2026-06-27", time:"22:00", venue:"Arrowhead Stadium, KC" },
  { id:72, group:"J", phase:"grupos", home:"Jordania",        homeFlag:"🇯🇴", away:"Argentina",           awayFlag:"🇦🇷", date:"2026-06-27", time:"22:00", venue:"AT&T Stadium, Arlington" },

  // ════════════════════════════════════════════════════════
  // 16avos DE FINAL — 28 jun al 3 jul 2026
  // ════════════════════════════════════════════════════════
  { id:73,  group:"", phase:"octavos", home:"2° Grupo A",  homeFlag:"⚡", away:"2° Grupo B",  awayFlag:"⚡", date:"2026-06-28", time:"15:00", venue:"SoFi Stadium, Los Ángeles",        bracket:"P73" },
  { id:74,  group:"", phase:"octavos", home:"1° Grupo E",  homeFlag:"⚡", away:"3° A/B/C/D/F",awayFlag:"⚡", date:"2026-06-29", time:"16:30", venue:"Gillette Stadium, Foxborough",      bracket:"P74" },
  { id:75,  group:"", phase:"octavos", home:"1° Grupo F",  homeFlag:"⚡", away:"2° Grupo C",  awayFlag:"⚡", date:"2026-06-29", time:"21:00", venue:"Est. Monterrey (BBVA)",             bracket:"P75" },
  { id:76,  group:"", phase:"octavos", home:"1° Grupo C",  homeFlag:"⚡", away:"2° Grupo F",  awayFlag:"⚡", date:"2026-06-29", time:"13:00", venue:"NRG Stadium, Houston",              bracket:"P76" },
  { id:77,  group:"", phase:"octavos", home:"1° Grupo I",  homeFlag:"⚡", away:"3° C/D/F/G/H",awayFlag:"⚡", date:"2026-06-30", time:"17:00", venue:"MetLife Stadium, NJ",               bracket:"P77" },
  { id:78,  group:"", phase:"octavos", home:"2° Grupo E",  homeFlag:"⚡", away:"2° Grupo I",  awayFlag:"⚡", date:"2026-06-30", time:"13:00", venue:"AT&T Stadium, Arlington",           bracket:"P78" },
  { id:79,  group:"", phase:"octavos", home:"1° Grupo A",  homeFlag:"⚡", away:"3° C/E/F/H/I",awayFlag:"⚡", date:"2026-06-30", time:"21:00", venue:"Est. Ciudad de México",             bracket:"P79" },
  { id:80,  group:"", phase:"octavos", home:"1° Grupo L",  homeFlag:"⚡", away:"3° E/H/I/J/K",awayFlag:"⚡", date:"2026-07-01", time:"12:00", venue:"Mercedes-Benz Stadium, Atlanta",    bracket:"P80" },
  { id:81,  group:"", phase:"octavos", home:"1° Grupo D",  homeFlag:"⚡", away:"3° B/E/F/I/J",awayFlag:"⚡", date:"2026-07-01", time:"20:00", venue:"Levi's Stadium, Santa Clara",      bracket:"P81" },
  { id:82,  group:"", phase:"octavos", home:"1° Grupo G",  homeFlag:"⚡", away:"3° A/E/H/I/J",awayFlag:"⚡", date:"2026-07-01", time:"16:00", venue:"Lumen Field, Seattle",              bracket:"P82" },
  { id:83,  group:"", phase:"octavos", home:"2° Grupo K",  homeFlag:"⚡", away:"2° Grupo L",  awayFlag:"⚡", date:"2026-07-02", time:"19:00", venue:"Est. Toronto (BMO)",                bracket:"P83" },
  { id:84,  group:"", phase:"octavos", home:"1° Grupo H",  homeFlag:"⚡", away:"2° Grupo J",  awayFlag:"⚡", date:"2026-07-02", time:"15:00", venue:"SoFi Stadium, Los Ángeles",         bracket:"P84" },
  { id:85,  group:"", phase:"octavos", home:"1° Grupo B",  homeFlag:"⚡", away:"3° E/F/G/I/J",awayFlag:"⚡", date:"2026-07-02", time:"23:00", venue:"Est. BC Place, Vancouver",           bracket:"P85" },
  { id:86,  group:"", phase:"octavos", home:"1° Grupo J",  homeFlag:"⚡", away:"2° Grupo H",  awayFlag:"⚡", date:"2026-07-03", time:"18:00", venue:"Hard Rock Stadium, Miami",          bracket:"P86" },
  { id:87,  group:"", phase:"octavos", home:"1° Grupo K",  homeFlag:"⚡", away:"3° D/E/I/J/L",awayFlag:"⚡", date:"2026-07-03", time:"21:30", venue:"Arrowhead Stadium, KC",             bracket:"P87" },
  { id:88,  group:"", phase:"octavos", home:"2° Grupo D",  homeFlag:"⚡", away:"2° Grupo G",  awayFlag:"⚡", date:"2026-07-03", time:"14:00", venue:"AT&T Stadium, Arlington",           bracket:"P88" },

  // ════════════════════════════════════════════════════════
  // OCTAVOS DE FINAL — 4 al 7 jul 2026
  // ════════════════════════════════════════════════════════
  { id:89,  group:"", phase:"cuartos", home:"Gan. P74", homeFlag:"🔥", away:"Gan. P77", awayFlag:"🔥", date:"2026-07-04", time:"17:00", venue:"Lincoln Financial, Philadelphia",   bracket:"P89" },
  { id:90,  group:"", phase:"cuartos", home:"Gan. P73", homeFlag:"🔥", away:"Gan. P75", awayFlag:"🔥", date:"2026-07-04", time:"13:00", venue:"NRG Stadium, Houston",               bracket:"P90" },
  { id:91,  group:"", phase:"cuartos", home:"Gan. P76", homeFlag:"🔥", away:"Gan. P78", awayFlag:"🔥", date:"2026-07-05", time:"16:00", venue:"MetLife Stadium, NJ",                bracket:"P91" },
  { id:92,  group:"", phase:"cuartos", home:"Gan. P79", homeFlag:"🔥", away:"Gan. P80", awayFlag:"🔥", date:"2026-07-05", time:"20:00", venue:"Est. Ciudad de México",              bracket:"P92" },
  { id:93,  group:"", phase:"cuartos", home:"Gan. P83", homeFlag:"🔥", away:"Gan. P84", awayFlag:"🔥", date:"2026-07-06", time:"15:00", venue:"AT&T Stadium, Arlington",            bracket:"P93" },
  { id:94,  group:"", phase:"cuartos", home:"Gan. P81", homeFlag:"🔥", away:"Gan. P82", awayFlag:"🔥", date:"2026-07-06", time:"20:00", venue:"Lumen Field, Seattle",               bracket:"P94" },
  { id:95,  group:"", phase:"cuartos", home:"Gan. P86", homeFlag:"🔥", away:"Gan. P88", awayFlag:"🔥", date:"2026-07-07", time:"12:00", venue:"Mercedes-Benz Stadium, Atlanta",    bracket:"P95" },
  { id:96,  group:"", phase:"cuartos", home:"Gan. P85", homeFlag:"🔥", away:"Gan. P87", awayFlag:"🔥", date:"2026-07-07", time:"16:00", venue:"Est. BC Place, Vancouver",           bracket:"P96" },

  // ════════════════════════════════════════════════════════
  // CUARTOS DE FINAL — 9 al 11 jul 2026
  // ════════════════════════════════════════════════════════
  { id:97,  group:"", phase:"semis", home:"Gan. P89", homeFlag:"💎", away:"Gan. P90", awayFlag:"💎", date:"2026-07-09", time:"16:00", venue:"Gillette Stadium, Foxborough",     bracket:"P97" },
  { id:98,  group:"", phase:"semis", home:"Gan. P93", homeFlag:"💎", away:"Gan. P94", awayFlag:"💎", date:"2026-07-10", time:"15:00", venue:"SoFi Stadium, Los Ángeles",        bracket:"P98" },
  { id:99,  group:"", phase:"semis", home:"Gan. P91", homeFlag:"💎", away:"Gan. P92", awayFlag:"💎", date:"2026-07-11", time:"17:00", venue:"Hard Rock Stadium, Miami",         bracket:"P99" },
  { id:100, group:"", phase:"semis", home:"Gan. P95", homeFlag:"💎", away:"Gan. P96", awayFlag:"💎", date:"2026-07-11", time:"21:00", venue:"Arrowhead Stadium, KC",            bracket:"P100" },

  // ════════════════════════════════════════════════════════
  // SEMIFINALES — 14 y 15 jul 2026
  // ════════════════════════════════════════════════════════
  { id:101, group:"", phase:"semis", home:"Gan. P97", homeFlag:"💎", away:"Gan. P98",  awayFlag:"💎", date:"2026-07-14", time:"15:00", venue:"AT&T Stadium, Arlington",         bracket:"SF1" },
  { id:102, group:"", phase:"semis", home:"Gan. P99", homeFlag:"💎", away:"Gan. P100", awayFlag:"💎", date:"2026-07-15", time:"15:00", venue:"Mercedes-Benz Stadium, Atlanta",  bracket:"SF2" },

  // ════════════════════════════════════════════════════════
  // TERCER PUESTO — 18 jul 2026
  // ════════════════════════════════════════════════════════
  { id:103, group:"", phase:"semis", home:"Per. SF1", homeFlag:"🥉", away:"Per. SF2", awayFlag:"🥉", date:"2026-07-18", time:"17:00", venue:"Hard Rock Stadium, Miami",         bracket:"3P" },

  // ════════════════════════════════════════════════════════
  // GRAN FINAL — 19 jul 2026, MetLife Stadium
  // ════════════════════════════════════════════════════════
  { id:104, group:"", phase:"final", home:"Gan. SF1", homeFlag:"👑", away:"Gan. SF2", awayFlag:"👑", date:"2026-07-19", time:"15:00", venue:"MetLife Stadium, NJ",              bracket:"FINAL" },
];
// ============================================================
// STORAGE HELPERS — Firebase Realtime Database
// ============================================================
import { dbSet, dbGet, dbListen } from './firebase.js';

async function storeGet(key) {
  return await dbGet("quiniela/" + key.replace(/[.#$/\[\]]/g, "_"));
}
async function storeSet(key, val) {
  return await dbSet("quiniela/" + key.replace(/[.#$/\[\]]/g, "_"), val);
}

// ============================================================
// SCORE ENGINE
// ============================================================
function calcScores(participants, matches, predictions) {
  const out = {};
  participants.forEach(p => {
    let total = 0, byPhase = {};
    Object.keys(PHASES).forEach(ph => { byPhase[ph] = 0; });
    matches.forEach(m => {
      if (!m.played) return;
      const key = `${p.id}::${m.id}`;
      const pred = predictions[key];
      if (!pred) return;
      const mult = PHASES[m.phase].multiplier;
      const joker = p.usedJoker?.[m.phase] === m.id ? 2 : 1;
    const isKnockout = m.phase !== "grupos";
const aWinner = m.homeScore > m.awayScore ? m.home : m.awayScore > m.homeScore ? m.away : m.avanza;
const pWinner = pred.h > pred.a ? m.home : pred.a > pred.h ? m.away : pred.avanza;
const aR = m.homeScore > m.awayScore ? "H" : m.awayScore > m.homeScore ? "A" : "D";
const pR = pred.h > pred.a ? "H" : pred.a > pred.h ? "A" : "D";
let pts = 0;
const correctWinner = isKnockout ? (pWinner === aWinner) : (pR === aR);
if (correctWinner) {
  pts += SCORING.resultado;
  if ((pred.h - pred.a) === (m.homeScore - m.awayScore)) pts += SCORING.diferencia;
  if (pred.h === m.homeScore && pred.a === m.awayScore) pts += SCORING.marcadorExacto;
}
      const earned = pts * mult * joker;
      total += earned;
      byPhase[m.phase] += earned;
    });
    out[p.id] = { total, byPhase };
  });
  return out;
}

// ============================================================
// UI ATOMS
// ============================================================
function Pill({ children, color = "emerald", size = "sm" }) {
  const bg = {
    emerald:"bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    sky:    "bg-sky-500/15 text-sky-300 border-sky-500/25",
    orange: "bg-orange-500/15 text-orange-300 border-orange-500/25",
    violet: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    amber:  "bg-amber-500/15 text-amber-300 border-amber-500/25",
    rose:   "bg-rose-500/15 text-rose-300 border-rose-500/25",
    slate:  "bg-slate-500/15 text-slate-400 border-slate-500/25",
  }[color] || "bg-slate-500/15 text-slate-400";
  const sz = size === "xs" ? "text-xs px-1.5 py-0.5" : "text-xs px-2.5 py-1";
  return <span className={`${sz} rounded-full border font-semibold ${bg}`}>{children}</span>;
}

function Toast({ msg, type }) {
  const colors = { ok:"bg-emerald-600", warn:"bg-amber-500", err:"bg-rose-600", info:"bg-sky-600" };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl animate-bounce ${colors[type]||"bg-slate-700"}`}>
      {msg}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-slate-400 text-xs font-semibold mb-1.5 uppercase tracking-wider">{label}</label>}
      <input className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors" {...props} />
    </div>
  );
}

// ============================================================
// LOGIN / REGISTER SCREEN
// ============================================================
function AuthScreen({ onLogin, toast }) {
  const [code, setCode]       = useState("");
  const [nick, setNick]       = useState("");
  const [avatar, setAvatar]   = useState("⚽");
  const [step, setStep]       = useState("code"); // code | register | adminLogin
  const [adminPwd, setAdminPwd] = useState("");
  const [err, setErr]         = useState("");

  const checkCode = () => {
    if (code.trim().toLowerCase() === INVITE_CODE.toLowerCase()) { setStep("register"); setErr(""); }
    else if (code.trim().toUpperCase() === "ADMIN") { setStep("adminLogin"); setErr(""); }
    else setErr("Código incorrecto. Pídele el código al organizador 😉");
  };

  const register = () => {
    if (!nick.trim()) { setErr("Elige un nickname"); return; }
    if (nick.trim().length < 3) { setErr("Mínimo 3 caracteres"); return; }
    onLogin({ id: `p_${Date.now()}`, nickname: nick.trim(), avatar, usedJoker: {}, isAdmin: false });
  };

  const adminLogin = () => {
    if (adminPwd === ADMIN_CODE) onLogin({ id: "admin", nickname: "Admin", avatar: "🔧", usedJoker: {}, isAdmin: true });
    else setErr("Contraseña incorrecta");
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-4xl">⚽</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">QUINIELA</h1>
          <p className="text-emerald-400 font-bold text-sm tracking-widest">MUNDIAL 2026</p>
          <p className="text-slate-500 text-xs mt-1">🇺🇸 USA · 🇲🇽 México · 🇨🇦 Canadá</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl">

          {step === "code" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Ingresa el código</h2>
                <p className="text-slate-500 text-sm">Pídele el código de invitación al organizador</p>
              </div>
              <Input
                label="Código de invitación"
                placeholder="Ej: MUNDIAL26"
                value={code}
                onChange={e => { setCode(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && checkCode()}
              />
              {err && <p className="text-rose-400 text-xs">{err}</p>}
              <button onClick={checkCode} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all text-sm">
                Entrar →
              </button>
              <p className="text-slate-700 text-xs text-center">Código demo: Mundi@l2026$! · Admin: ADMIN</p>
            </div>
          )}

          {step === "register" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-white font-bold text-lg mb-1">¡Crea tu perfil!</h2>
                <p className="text-slate-500 text-sm">Elige un nickname y tu avatar para la quiniela</p>
              </div>
              <Input
                label="Tu nickname"
                placeholder="Ej: ElPulgaFan, Golazo99…"
                value={nick}
                onChange={e => { setNick(e.target.value); setErr(""); }}
                maxLength={40}
              />
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Tu avatar</label>
                <div className="grid grid-cols-10 gap-1.5">
                  {AVATAR_EMOJIS.map(em => (
                    <button
                      key={em}
                      onClick={() => setAvatar(em)}
                      className={`text-xl rounded-lg py-1 transition-all ${avatar === em ? "bg-emerald-500/30 ring-1 ring-emerald-400" : "hover:bg-slate-700"}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
              {err && <p className="text-rose-400 text-xs">{err}</p>}
              <div className="bg-slate-800/60 rounded-xl p-3 flex items-center gap-3">
                <span className="text-3xl">{avatar}</span>
                <div>
                  <p className="text-white font-bold">{nick || "Tu nombre aquí"}</p>
                  <p className="text-slate-500 text-xs">Así te verán los demás</p>
                </div>
              </div>
              <button onClick={register} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all text-sm">
                ¡Unirme a la Quiniela! ⚽
              </button>
              <button onClick={() => { setStep("code"); setErr(""); }} className="w-full text-slate-600 text-xs hover:text-slate-400 py-1">
                ← Volver
              </button>
            </div>
          )}

          {step === "adminLogin" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-amber-400 font-bold text-lg mb-1">🔧 Panel Admin</h2>
                <p className="text-slate-500 text-sm">Acceso exclusivo para el organizador</p>
              </div>
              <Input
                label="Contraseña admin"
                type="password"
                placeholder="••••••••"
                value={adminPwd}
                onChange={e => { setAdminPwd(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && adminLogin()}
              />
              {err && <p className="text-rose-400 text-xs">{err}</p>}
              <button onClick={adminLogin} className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl transition-all text-sm">
                Entrar como Admin
              </button>
              <p className="text-slate-700 text-xs text-center">Contraseña demo: admin2026</p>
              <button onClick={() => { setStep("code"); setErr(""); }} className="w-full text-slate-600 text-xs hover:text-slate-400 py-1">
                ← Volver
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LEADERBOARD (scalable: search + virtual scroll feel)
// ============================================================
function Leaderboard({ participants, scores, currentPhase, currentUser }) {
  const [search, setSearch] = useState("");

  const sorted = [...participants]
    .map(p => ({ ...p, score: scores[p.id]?.total || 0, phaseScore: scores[p.id]?.byPhase?.[currentPhase] || 0 }))
    .sort((a, b) => b.score - a.score);

  const filtered = search
    ? sorted.filter(p => p.nickname.toLowerCase().includes(search.toLowerCase()))
    : sorted;

  const leader = sorted[0];
  const myRank = sorted.findIndex(p => p.id === currentUser?.id) + 1;
  const myData = sorted.find(p => p.id === currentUser?.id);

  return (
    <div className="space-y-4">
      {/* My position card (always visible) */}
      {myData && !currentUser?.isAdmin && (
        <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-700/30 rounded-2xl p-4 flex items-center gap-4">
          <div className="text-3xl font-black text-emerald-400">#{myRank}</div>
          <span className="text-3xl">{myData.avatar}</span>
          <div className="flex-1">
            <p className="text-white font-bold">{myData.nickname} <span className="text-emerald-400 text-xs">(tú)</span></p>
            <p className="text-slate-400 text-xs">{myData.phaseScore} pts esta fase · {PHASES[currentPhase]?.multiplier}x</p>
          </div>
          <div className="text-right">
            <p className="text-white font-black text-2xl">{myData.score}</p>
            <p className="text-slate-500 text-xs">pts totales</p>
          </div>
        </div>
      )}

      {/* Search for big groups */}
      {participants.length > 10 && (
        <div className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar participante..."
            className="w-full bg-slate-800/60 border border-slate-700 text-white rounded-xl pl-4 pr-10 py-2.5 text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">✕</button>}
        </div>
      )}

      {/* Phase selector info */}
      <div className="flex items-center justify-between px-1">
        <p className="text-slate-400 text-xs">{filtered.length} participante{filtered.length !== 1 ? "s" : ""}</p>
        <Pill color={PHASES[currentPhase]?.color}>{PHASES[currentPhase]?.emoji} {PHASES[currentPhase]?.label} · {PHASES[currentPhase]?.multiplier}x</Pill>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-3 px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/50">
          <span className="text-slate-500 text-xs font-bold">#</span>
          <span className="text-slate-500 text-xs font-bold">Jugador</span>
          <span className="text-slate-500 text-xs font-bold text-right">Fase</span>
          <span className="text-slate-500 text-xs font-bold text-right">Total</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
          {filtered.map((p, i) => {
            const rank = sorted.findIndex(s => s.id === p.id) + 1;
            const isMe = p.id === currentUser?.id;
            const isTop3 = rank <= 3;
            const medals = ["🥇","🥈","🥉"];
            const gap = rank === 1 ? null : p.score - leader.score;

            return (
              <div key={p.id} className={`grid grid-cols-[2rem_1fr_auto_auto] gap-3 px-4 py-3 items-center transition-colors ${isMe ? "bg-emerald-500/5" : "hover:bg-slate-800/30"}`}>
                <span className={`text-sm font-black text-center ${isTop3 ? "" : "text-slate-600"}`}>
                  {isTop3 ? medals[rank-1] : rank}
                </span>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-3xl flex-shrink-0">{p.avatar}</span>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${isMe ? "text-emerald-300" : "text-white"}`}>
                      {p.nickname}{isMe && <span className="text-emerald-500 text-xs ml-1">·tú</span>}
                    </p>
                    {gap !== null && <p className="text-slate-600 text-xs">{gap} del líder</p>}
                    {gap === null && <p className="text-amber-500 text-xs font-semibold">Líder 👑</p>}
                  </div>
                </div>
                <span className="text-slate-400 text-sm font-semibold text-right">{p.phaseScore}</span>
                <span className={`font-black text-right ${isTop3 ? "text-white" : "text-slate-300"}`}>{p.score}</span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-slate-600">
              <p className="text-2xl mb-1">🔍</p>
              <p className="text-sm">No encontramos "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MATCH CARD
// ============================================================
function MatchCard({ match, user, prediction, onPredict, onSetResult, isAdmin, participants, allPredictions }) {
const [ph, setPh] = useState(prediction?.h ?? "");
const [pa, setPa] = useState(prediction?.a ?? "");
const [avanza, setAvanza] = useState(prediction?.avanza ?? "");
const [dirty, setDirty] = useState(false);
const [rh, setRh] = useState(match.homeScore ?? "");
const [ra, setRa] = useState(match.awayScore ?? "");
const [ravanza, setRavanza] = useState(match.avanza ?? "");
const isKnockout = match.phase !== "grupos";

  const phase = PHASES[match.phase];
  const joker = user?.usedJoker?.[match.phase] === match.id;

  const aR = match.played ? (match.homeScore > match.awayScore ? "H" : match.awayScore > match.homeScore ? "A" : "D") : null;
  const pR = prediction ? (prediction.h > prediction.a ? "H" : prediction.a > prediction.h ? "A" : "D") : null;
  const correct = aR && pR && aR === pR;
  const exact = correct && prediction?.h === match.homeScore && prediction?.a === match.awayScore;

  let borderClass = "border-slate-800";
  if (match.played && prediction) {
    if (exact) borderClass = "border-amber-500/60";
    else if (correct) borderClass = "border-emerald-600/50";
    else borderClass = "border-rose-800/50";
  }

  return (
    <div className={`bg-slate-900/60 rounded-2xl border ${borderClass} overflow-hidden`}>
      {/* Phase bar */}
      <div className={`px-4 py-2 flex items-center justify-between bg-slate-800/40`}>
        <Pill color={phase.color} size="xs">{phase.emoji} {phase.label} · {phase.multiplier}x</Pill>
        <div className="flex items-center gap-2">
          {joker && <Pill color="violet" size="xs">🃏 2x</Pill>}
          {match.liveScore && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /><span className="text-rose-400 text-xs font-bold">EN VIVO</span></span>}
          <span className="text-slate-600 text-xs">{match.date} {match.time}</span>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-center w-28">
          <div className="text-3xl mb-1">{match.homeFlag}</div>
          <div className="text-white font-bold text-sm leading-tight">{match.home}</div>
        </div>

        <div className="text-center flex-1">
          {match.played ? (
            <>
              <div className="text-white font-black text-3xl tracking-widest">{match.homeScore}–{match.awayScore}</div>
              <div className="mt-1 text-xs">
                {exact   ? <span className="text-amber-400 font-bold">⭐ ¡Marcador exacto!</span>
                 : correct ? <span className="text-emerald-400 font-semibold">✓ Resultado correcto</span>
                 : prediction ? <span className="text-rose-400">✗ No acertaste</span>
                 : <span className="text-slate-600">Sin predicción</span>}
              </div>
            </>
          ) : match.liveScore ? (
            <div className="text-white font-black text-3xl tracking-widest text-rose-400">{match.liveScore}</div>
          ) : (
            <div className="text-slate-600 text-xl font-bold">VS</div>
          )}
          <div className="text-slate-700 text-xs mt-1">📍 {match.venue}</div>
        </div>

        <div className="text-center w-28">
          <div className="text-3xl mb-1">{match.awayFlag}</div>
          <div className="text-white font-bold text-sm leading-tight">{match.away}</div>
        </div>
      </div>

      {/* Prediction input */}
      {!match.played && !user?.isAdmin && new Date() < new Date(match.date + "T" + match.time.replace(":",":") + ":00-04:00") && (
        <div className="border-t border-slate-800 px-4 py-3">
         <p className="text-slate-500 text-xs text-center mb-2">
  {isKnockout 
    ? (prediction ? `Tu predicción (90 min): ${prediction.h}–${prediction.a}${prediction.avanza ? " · Avanza: "+prediction.avanza : ""} · Editar:` : "Tu predicción al 90 min:")
    : (prediction ? `Tu predicción: ${prediction.h}–${prediction.a} · Editar:` : "Tu predicción:")}
</p>
          <div className="flex items-center gap-2 justify-center">
            <input type="number" min="0" max="20" value={ph} onChange={e => { setPh(e.target.value); setDirty(true); }}
              className="w-14 text-center bg-slate-800 border border-slate-700 text-white rounded-xl py-2 text-lg font-black focus:outline-none focus:border-emerald-500" placeholder="0" />
            <span className="text-slate-600 font-black text-xl">—</span>
            <input type="number" min="0" max="20" value={pa} onChange={e => { setPa(e.target.value); setDirty(true); }}
              className="w-14 text-center bg-slate-800 border border-slate-700 text-white rounded-xl py-2 text-lg font-black focus:outline-none focus:border-emerald-500" placeholder="0" />
         {isKnockout && parseInt(ph) === parseInt(pa) && ph !== "" && (
  <div className="flex gap-2 justify-center mb-2">
    <button onClick={() => { setAvanza(match.home); setDirty(true); }}
      className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl border transition-all ${avanza === match.home ? "bg-emerald-600 text-white border-emerald-500" : "border-slate-600 text-slate-400 hover:border-emerald-600"}`}>
      {match.homeFlag} {match.home}
    </button>
    <button onClick={() => { setAvanza(match.away); setDirty(true); }}
      className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl border transition-all ${avanza === match.away ? "bg-emerald-600 text-white border-emerald-500" : "border-slate-600 text-slate-400 hover:border-emerald-600"}`}>
      {match.awayFlag} {match.away}
    </button>
  </div>
)}
<button
  onClick={() => {
    if (ph !== "" && pa !== "") {
      const pred = { h: parseInt(ph), a: parseInt(pa) };
      if (isKnockout && parseInt(ph) === parseInt(pa)) {
        if (!avanza) { alert("Selecciona quién avanza"); return; }
        pred.avanza = avanza;
      } else if (isKnockout) {
        pred.avanza = parseInt(ph) > parseInt(pa) ? match.home : match.away;
      }
      onPredict(match.id, pred);
      setDirty(false);
    }
  }}
  className={`font-bold px-4 py-2 rounded-xl text-sm transition-all text-white ${dirty ? "bg-amber-500 hover:bg-amber-400 animate-pulse" : "bg-emerald-600 hover:bg-emerald-500"}`}
>
  {dirty ? "⚠️ Guardar" : prediction ? "✏️ Guardado" : "✅ Guardar"}
</button>
          </div>
        </div>
      )}
{/* Comparison — show all predictions after match is played */}
     {(match.played || new Date() > new Date(match.date + "T" + match.time + ":00-04:00")) && participants && participants.length > 0 && (
        <div className="border-t border-slate-800 px-4 py-3">
          <p className="text-slate-500 text-xs font-bold mb-2">📊 Predicciones de todos:</p>
          <div className="space-y-1.5">
            {participants.map(p => {
              const pred = allPredictions?.[p.id + "::" + match.id];
              if (!pred) return null;
              const pR = pred.h > pred.a ? "H" : pred.a > pred.h ? "A" : "D";
              const aR = match.homeScore > match.awayScore ? "H" : match.awayScore > match.homeScore ? "A" : "D";
              const ok = pR === aR;
              const ex = ok && pred.h === match.homeScore && pred.a === match.awayScore;
              return (
                <div key={p.id} className="flex items-center gap-2 text-xs">
                  <span>{p.avatar}</span>
                  <span className="text-slate-300 flex-1 truncate">{p.nickname}</span>
                  <span className="font-black text-white">{pred.h}–{pred.a}</span>
                  <span>{ex ? "⭐" : ok ? "✓" : "✗"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Admin result entry */}
      {isAdmin && !match.played && (
  <div className="border-t border-amber-900/40 px-4 py-3 bg-amber-950/20">
    <p className="text-amber-500 text-xs text-center font-bold mb-2">🔧 Cargar resultado oficial</p>
{isKnockout && <p className="text-amber-400 text-xs text-center mb-2">⏱️ Marcador al 90 minutos</p>}
    <div className="flex items-center gap-2 justify-center">
      <input type="number" min="0" max="20" value={rh} onChange={e => setRh(e.target.value)}
        className="w-14 text-center bg-slate-800 border border-amber-700/50 text-amber-300 rounded-xl py-2 text-lg font-black focus:outline-none" />
      <span className="text-amber-700 font-black">—</span>
      <input type="number" min="0" max="20" value={ra} onChange={e => setRa(e.target.value)}
        className="w-14 text-center bg-slate-800 border border-amber-700/50 text-amber-300 rounded-xl py-2 text-lg font-black focus:outline-none" />
      <button
        onClick={() => { if (rh !== "" && ra !== "") onSetResult(match.id, parseInt(rh), parseInt(ra), ravanza || null); }}
        className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all"
      >
        ⚡ Confirmar
      </button>
    </div>
    {isKnockout && parseInt(rh) === parseInt(ra) && rh !== "" && (
      <div className="flex gap-2 mt-2">
        <button onClick={() => setRavanza(match.home)}
          className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-all ${ravanza === match.home ? "bg-amber-600 text-white border-amber-500" : "border-slate-600 text-slate-400"}`}>
          {match.homeFlag} {match.home}
        </button>
        <button onClick={() => setRavanza(match.away)}
          className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-all ${ravanza === match.away ? "bg-amber-600 text-white border-amber-500" : "border-slate-600 text-slate-400"}`}>
          {match.awayFlag} {match.away}
        </button>
      </div>
    )}
  </div>
)}
    </div>
  );
}

// ============================================================
// JOKER PANEL
// ============================================================
function JokerPanel({ user, matches, currentPhase, onUseJoker }) {
  const phaseMatches = matches.filter(m => m.phase === currentPhase && !m.played);
  const used = user?.usedJoker?.[currentPhase];
  const usedMatch = used ? matches.find(m => m.id === used) : null;

  return (
    <div className="bg-gradient-to-br from-violet-950/60 to-slate-900 border border-violet-800/40 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-xl">🃏</div>
        <div>
          <h3 className="text-white font-bold">Comodín de Fase</h3>
          <p className="text-violet-400 text-xs">Dobla tus puntos en 1 partido · 1 por fase</p>
        </div>
      </div>

      {/* Phase tracker */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {Object.entries(PHASES).map(([ph, data]) => {
          const u = user?.usedJoker?.[ph];
          return (
            <div key={ph} className={`text-center rounded-xl py-2 border text-xs ${u ? "bg-violet-500/20 border-violet-500/40" : ph === currentPhase ? "border-violet-700/50 bg-violet-900/20" : "border-slate-800 bg-slate-900/40"}`}>
              <div>{data.emoji}</div>
              <div className={`font-bold ${u ? "text-violet-300" : "text-slate-600"}`}>{u ? "✓" : "–"}</div>
            </div>
          );
        })}
      </div>

      {used ? (
        <div className="bg-violet-900/30 border border-violet-700/30 rounded-xl p-4 text-center">
          <p className="text-violet-300 font-semibold text-sm">✅ Comodín activado esta fase</p>
          {usedMatch && <p className="text-slate-400 text-xs mt-1">{usedMatch.homeFlag} {usedMatch.home} vs {usedMatch.away} {usedMatch.awayFlag}</p>}
        </div>
      ) : phaseMatches.length === 0 ? (
        <div className="text-slate-600 text-sm text-center py-4">No hay partidos pendientes en esta fase</div>
      ) : (
        <div className="space-y-2">
          <p className="text-slate-400 text-xs mb-3">Elige el partido para doblar tus puntos en {PHASES[currentPhase]?.label}:</p>
          {phaseMatches.map(m => (
            <button key={m.id} onClick={() => onUseJoker(currentPhase, m.id)}
              className="w-full flex items-center justify-between bg-slate-800/60 hover:bg-violet-900/30 border border-slate-700 hover:border-violet-700/50 rounded-xl px-4 py-3 transition-all">
              <span className="text-white text-sm">{m.homeFlag} {m.home} vs {m.away} {m.awayFlag}</span>
              <Pill color="violet" size="xs">2× activar</Pill>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SPECIAL PREDICTIONS
// ============================================================
function SpecialPreds({ user, specials, onSave }) {
  const mine = specials[user?.id] || {};
  const [form, setForm] = useState({ campeon: mine.campeon||"", subcampeon: mine.subcampeon||"", goleador: mine.goleador||"" });

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div>
        <h3 className="text-white font-bold text-lg">🎯 Predicciones Especiales</h3>
        <p className="text-slate-500 text-sm">Se contabilizan al finalizar el torneo</p>
      </div>

      {[
        { key:"campeon",    label:"🏆 Campeón del Mundo",   bonus:SCORING.campeon,    options:TEAMS,   type:"team" },
        { key:"subcampeon", label:"🥈 Subcampeón",          bonus:SCORING.subcampeon, options:TEAMS,   type:"team" },
        { key:"goleador",   label:"⚽ Goleador del Torneo", bonus:SCORING.goleador,   options:PLAYERS, type:"player" },
      ].map(({ key, label, bonus, options }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-white text-sm font-semibold">{label}</label>
            <Pill color="amber">+{bonus} pts</Pill>
          </div>
          <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
            <option value="">Selecciona...</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}

      {new Date() < new Date("2026-06-14T23:59:00-04:00") ? (
        <button onClick={() => onSave(user.id, form)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition-all">
          💾 Guardar predicciones especiales
        </button>
      ) : (
        <div className="w-full bg-slate-800 text-slate-500 font-bold py-3 rounded-xl text-sm text-center">
          🔒 Predicciones especiales bloqueadas — torneo en curso
        </div>
      )}
      {(mine.campeon || mine.subcampeon || mine.goleador) && (
        <div className="bg-slate-800/40 rounded-xl p-3 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">Guardadas:</p>
          {mine.campeon    && <p>🏆 {mine.campeon}</p>}
          {mine.subcampeon && <p>🥈 {mine.subcampeon}</p>}
          {mine.goleador   && <p>⚽ {mine.goleador}</p>}
        </div>
      )}
    </div>
  );
}

// ============================================================
// AI MESSAGES
// ============================================================
function AIMessages({ participants, matches, scores, isAdmin, predictions }) {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar mensajes guardados al iniciar
  useEffect(() => {
    storeGet("q26:messages").then(function(data) {
      if (data && data.msgs) setMsgs(data.msgs);
    });
  }, []);

  const generate = async () => {
    setLoading(true);
    const sorted = [...participants]
      .map(p => ({ ...p, score: scores[p.id]?.total || 0 }))
      .sort((a,b) => b.score - a.score);
    const played = matches.filter(m => m.played);
    const last = played[played.length - 1];
const lastMatch = last ? `Ultimo partido: ${last.home} ${last.homeScore}-${last.awayScore} ${last.away}` : "Torneo por comenzar";
const lastMatchId = last ? last.id : null;
const resultados = lastMatchId ? sorted.slice(0,12).map(p => {
  const pred = Object.keys(scores).length > 0 ? null : null;
  const key = p.id + "::" + lastMatchId;
  return p.nickname;
}).join(",") : "";

const playersWithResults = lastMatchId ? sorted.slice(0,12).map(p => {
  const key = p.id + "::" + lastMatchId;
  const allPreds = predictions || {};
  const pred = allPreds[key];
  const aR = last.homeScore > last.awayScore ? "H" : last.awayScore > last.homeScore ? "A" : "D";
  const pR = pred ? (pred.h > pred.a ? "H" : pred.a > pred.h ? "A" : "D") : null;
  const exact = pred && pred.h === last.homeScore && pred.a === last.awayScore;
  const correct = pR && pR === aR;
  const result = !pred ? "no_pred" : exact ? "exact" : correct ? "correct" : "wrong";
  const styles = ["chapin","mexicano","spanglish","english"];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return p.nickname+"("+p.score+"pts,"+( p.gender||"M")+","+result+","+style+")";
}).join(", ") : sorted.slice(0,12).map((p,i) => p.nickname+"("+p.score+"pts,"+(p.gender||"M")+")").join(", ");

const prompt = `Eres "El Animador Mundialista" de una quiniela familiar del Mundial 2026. Genera exactamente ${Math.min(participants.length, 12)} mensajes personalizados, max 25 palabras cada uno.

${lastMatch}
Participantes (nombre, puntos, genero, resultado_ultimo_partido, idioma_a_usar):
${playersWithResults}

Reglas de idioma:
Nota especial: "Aurora Y Moose" es una chica con su perro salchicha Moose (haired dachshund in English). Menciona al perro  en su mensaje para hacerlo gracioso.
Nota especial: "Mundi2026&" es mexicana, siempre usar estilo mexicano con ella (por ejemplo: No mamcnes, órale, chingón, no manches, wey).
- chapin: español guatemalteco (vos, shumo, vieras que, no jodas, que chivo)
- mexicano: español mexicano (órale, chido, no manches, wey, híjole)  
- spanglish: mezcla natural español/inglés estilo Miami
- english: full English Miami style (casual, funny, with some Spanish words)

Reglas de resultado:
- exact: acertó marcador exacto → felicitarlo exageradamente y burlarse de los demás
- correct: acertó ganador → elogio moderado
- wrong: falló → burla amigable
- no_pred: no puso predicción → regañarlo

Usa el género correcto en español. Con emojis y humor amigable.
Responde SOLO con JSON array sin markdown: [{"nickname":"...","mensaje":"..."}]`;

    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages:[{role:"user",content:prompt}] })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text||"").join("") || "[]";
      console.log("===RAW RESPONSE FROM API===");
      console.log(text);
      console.log("===END RAW===");
      
var parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setMsgs(parsed);
      storeSet("q26:messages", { timestamp: new Date().toISOString(), msgs: parsed });
    } catch (e) {
      console.error("ERROR:", e.message);
      console.error("Full error:", e);
      setMsgs([{ nickname:"Sistema", mensaje:"⚽ Error: " + e.message }]);
    }
    setLoading(false);
  };

  const colors = ["from-emerald-900/30 to-emerald-800/10 border-emerald-800/40",
    "from-amber-900/30 to-amber-800/10 border-amber-800/40",
    "from-violet-900/30 to-violet-800/10 border-violet-800/40",
    "from-sky-900/30 to-sky-800/10 border-sky-800/40",
    "from-rose-900/30 to-rose-800/10 border-rose-800/40"];

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-bold text-lg">🤖 Mensajes de la IA</h3>
{isAdmin && <button onClick={generate} disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
            {loading ? "⏳ Generando..." : "✨ Generar"}
          </button>}
        </div>
        <p className="text-slate-500 text-xs">Mensajes personalizados basados en resultados y posiciones reales</p>
      </div>

      {loading && [1,2,3].map(i => <div key={i} className="animate-pulse bg-slate-800/50 rounded-2xl h-20 border border-slate-800" />)}

      {msgs.map((m, i) => {
        const p = participants.find(p => p.nickname.toLowerCase() === m.nickname?.toLowerCase()) || participants[i];
        return (
          <div key={i} className={`bg-gradient-to-r ${colors[i%colors.length]} border rounded-2xl p-4 flex items-start gap-3`}>
            <span className="text-2xl mt-0.5">{p?.avatar || "⚽"}</span>
            <div>
              <p className="text-white font-bold text-sm">{m.nickname}</p>
              <p className="text-slate-300 text-sm mt-0.5 leading-relaxed">{m.mensaje}</p>
            </div>
          </div>
        );
      })}

      {msgs.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-600">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-sm">Presiona "Generar" para que la IA cree mensajes personalizados</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel({ participants, matches, predictions, specials, scores, onResetMatch }) {
  const sorted = [...participants].map(p => ({ ...p, score: scores[p.id]?.total || 0 })).sort((a,b) => b.score - a.score);
  const played = matches.filter(m => m.played).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label:"Participantes", val:participants.length, color:"emerald", icon:"👥" },
          { label:"Partidos jugados", val:`${played}/${matches.length}`, color:"amber", icon:"⚽" },
          { label:"Predicciones", val:Object.keys(predictions).length, color:"sky", icon:"📊" },
          { label:"Especiales", val:Object.keys(specials).length, color:"violet", icon:"🎯" },
        ].map(({ label, val, icon }) => (
          <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-white font-black text-2xl">{val}</p>
            <p className="text-slate-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800">
          <h3 className="text-white font-bold">📋 Todos los participantes</h3>
        </div>
        <div className="divide-y divide-slate-800/50 max-h-80 overflow-y-auto">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-slate-600 text-xs w-5 text-right">{i+1}</span>
              <span className="text-xl">{p.avatar}</span>
              <span className="text-white text-sm flex-1">{p.nickname}</span>
              <span className="text-slate-400 text-sm font-bold">{p.score} pts</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-950/30 border border-amber-800/30 rounded-2xl p-4">
        <p className="text-amber-400 font-bold text-sm mb-2">ℹ️ Código de invitación</p>
        <div className="bg-slate-900 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-white font-black text-xl tracking-widest">{INVITE_CODE}</span>
          <span className="text-slate-500 text-xs">Comparte este código</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser]               = useState(() => {
    try {
      const saved = localStorage.getItem("q26_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches]         = useState(SEED_MATCHES.map(m => ({ ...m, played:false, homeScore:null, awayScore:null })));
  const [predictions, setPredictions] = useState({});
  const [specials, setSpecials]       = useState({});
  const getCurrentPhase = () => {
    const now = new Date();
    const phases = [
      { phase: "final",   start: new Date("2026-07-19") },
      { phase: "semis",   start: new Date("2026-07-14") },
      { phase: "cuartos", start: new Date("2026-07-09") },
      { phase: "octavos", start: new Date("2026-06-28") },
      { phase: "grupos",  start: new Date("2026-06-11") },
    ];
    for (var i = 0; i < phases.length; i++) {
      if (now >= phases[i].start) return phases[i].phase;
    }
    return "grupos";
  };
const [currentPhase, setCurrentPhase] = useState("grupos");
  const [tab, setTab]                 = useState("tabla");
  const [toast, setToast]             = useState(null);
  const [loaded, setLoaded]           = useState(false);
  const [liveRefresh, setLiveRefresh] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("all");
 const nextMatchId = matches.find(m => !m.played)?.id;

  const scores = calcScores(participants, matches, predictions);

  // ── Load from shared storage ──
  useEffect(() => {
    (async () => {
      const p  = await storeGet("q26:participants");
      const m  = await storeGet("q26:matches");
      const pr = await storeGet("q26:predictions");
      const sp = await storeGet("q26:specials");
      if (p)  setParticipants(p);
      if (m)  setMatches(m);
      if (pr) setPredictions(pr);
      if (sp) setSpecials(sp);
      setLoaded(true);
    })();
  }, []);

  // ── Persist on change ──
  
  useEffect(() => { if (loaded) storeSet("q26:matches",      matches);      }, [matches,      loaded]);
  useEffect(() => { if (loaded) storeSet("q26:specials",     specials);     }, [specials,      loaded]);

  // ── Live-score polling simulation ──
  // (In production, connect to football-data.org API with your key)
  // We show the architecture but don't expose API keys here.
useEffect(() => {
    if (tab === "partidos") {
      setTimeout(() => {
        const el = document.getElementById("next-match");
        if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
      }, 500);
    }
  }, [tab, currentPhase]);

  useEffect(() => {
    if (!liveRefresh) return;
    const id = setInterval(() => showToast("🔄 Resultados actualizados", "info"), 60000);
    return () => clearInterval(id);
  }, [liveRefresh]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── WhatsApp share ──
const shareWhatsApp = () => {
    const sorted = [...participants]
      .map(p => ({ ...p, score: scores[p.id]?.total || 0 }))
      .sort((a, b) => b.score - a.score);
    const played = matches.filter(m => m.played);
    const lastMatch = played[played.length - 1];
    const pending = matches.filter(m => !m.played).length;
    var lines = [];
    lines.push(String.fromCodePoint(0x26BD) + String.fromCodePoint(0x1F3C6) + " *QUINIELA MUNDIAL 2026* " + String.fromCodePoint(0x1F3C6) + String.fromCodePoint(0x26BD));
    lines.push("======================");
    lines.push("");
    if (lastMatch) {
      lines.push(String.fromCodePoint(0x1F4FA) + " *Ultimo resultado:*");
      lines.push(lastMatch.home + " *" + lastMatch.homeScore + " - " + lastMatch.awayScore + "* " + lastMatch.away);
      lines.push("");
    }
    lines.push(String.fromCodePoint(0x1F3C6) + " *TABLA DE POSICIONES:*");
    sorted.forEach(function(p, i) {
      lines.push((i+1) + ". " + p.nickname + ": *" + p.score + " pts*");
    });
    lines.push("");
    lines.push(played.length + " jugados - " + pending + " pendientes");
    lines.push("Multiplicador: " + PHASES[currentPhase].multiplier + "x (" + PHASES[currentPhase].label + ")");
    lines.push("");
    lines.push(String.fromCodePoint(0x1F449) + " Entra: https://quiniela-mundial-2026-five-opal.vercel.app");
    lines.push(String.fromCodePoint(0x1F511) + " Codigo: Mundi@l2026$!");
    var msg = lines.join("\n");
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      navigator.share({ text: msg }).catch(function() {});
    } else {
      navigator.clipboard.writeText(msg).then(function() {
        showToast("Copiado! Pegalo en WhatsApp", "ok");
      }).catch(function() {
        var ta = document.createElement("textarea");
        ta.value = msg;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("Copiado! Pegalo en WhatsApp o Mensaje de Texto", "ok");
      });
    }
  };

const handleLogin = (u) => {
    if (!u.isAdmin) {
      var existing = participants.find(function(p) { return p.nickname === u.nickname; });
      if (existing) {
        u = Object.assign({}, existing);
      } else {
        storeGet("q26:participants").then(function(current) {
          var list = current || [];
          var alreadyExists = list.find(function(p) { return p.nickname === u.nickname; });
          if (!alreadyExists) {
            list.push(u);
            storeSet("q26:participants", list);
          }
          setParticipants(list);
        });
        fetch("/api/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname: u.nickname, participants: participants }),
        }).then(function(r) { return r.json(); }).then(function(d) {
          if (d.message) showToast(d.message);
        }).catch(function() { showToast("Bienvenido " + u.nickname + "!"); });
      }
    }
    setUser(u);
    try { localStorage.setItem("q26_user", JSON.stringify(u)); } catch {}
    setTab(u.isAdmin ? "admin" : "tabla");
  };
       
const handlePredict = (matchId, pred) => {
    const key = `${user.id}::${matchId}`;
    const predWithTs = { h: pred.h, a: pred.a, ts: new Date().toISOString() };
    setPredictions(prev => ({ ...prev, [key]: predWithTs }));
    storeGet("q26:predictions").then(function(current) {
      var all = current || {};
      all[key] = predWithTs;
      storeSet("q26:predictions", all);
    });
    showToast("✅ Predicción guardada");
  };

  const handleSetResult = (matchId, h, a, avanza) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const winner = h > a ? m.home : a > h ? m.away : avanza;
      return { ...m, homeScore:h, awayScore:a, played:true, avanza: winner };
    }));
    showToast("⚡ Resultado cargado", "warn");
  };

  const handleUseJoker = (phase, matchId) => {
    setParticipants(prev => prev.map(p => p.id === user.id ? { ...p, usedJoker: { ...p.usedJoker, [phase]: matchId } } : p));
    setUser(u => ({ ...u, usedJoker: { ...u.usedJoker, [phase]: matchId } }));
    showToast("🃏 ¡Comodín activado! Puntos dobles 🔥", "ok");
  };

  const handleSaveSpecial = (uid, form) => {
    setSpecials(prev => ({ ...prev, [uid]: form }));
    showToast("🎯 Predicciones especiales guardadas");
  };

  // ── Not logged in ──
  if (!loaded) return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center"><div className="text-5xl animate-bounce mb-4">⚽</div><p className="text-slate-500 text-sm">Cargando quiniela...</p></div>
    </div>
  );
  if (!user) return <AuthScreen onLogin={handleLogin} />;

  // ── Phase matches ──
  const phaseMatches = matches.filter(m => {
    if (m.phase !== currentPhase) return false;
    if (currentPhase === "grupos" && selectedGroup !== "all") return m.group === selectedGroup;
    return true;
  });
  const meAsParticipant = participants.find(p => p.id === user.id);

  const TABS = user.isAdmin
    ? [{ id:"admin", label:"⚙️ Admin" }, { id:"tabla", label:"🏆 Tabla" }, { id:"partidos", label:"⚽ Partidos" }, { id:"llaves", label:"🗂 Llaves" }, { id:"mensajes", label:"🤖 IA" }]
    : [{ id:"tabla", label:"🏆 Tabla" }, { id:"partidos", label:"⚽ Partidos" }, { id:"llaves", label:"🗂 Llaves" }, { id:"especiales", label:"🎯 Especiales" }, { id:"comodin", label:"🃏 Comodín" }, { id:"mensajes", label:"🤖 IA" }];

  return (
    <div className="min-h-screen bg-[#0a0e1a]" style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="bg-slate-950/80 border-b border-slate-800/60 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚽</span>
              <div>
                <p className="text-white font-black text-sm tracking-tight leading-none">QUINIELA 2026</p>
                <p className="text-slate-600 text-xs">FIFA World Cup</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {liveRefresh && <span className="flex items-center gap-1 text-xs text-rose-400"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />Live</span>}
              <div className="flex items-center gap-2 bg-slate-800/80 rounded-full px-3 py-1.5">
                <span className="text-base">{user.avatar}</span>
                <span className="text-white text-xs font-semibold">{user.nickname}</span>
                {!user.isAdmin && <span className="text-emerald-400 text-xs font-black">{scores[user.id]?.total || 0}pts</span>}
                {user.isAdmin && <Pill color="amber" size="xs">admin</Pill>}
              </div>
              {user.isAdmin && <button onClick={shareWhatsApp} className="text-green-500 hover:text-green-400 text-xs px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-all" title="Compartir">📲</button>}
              <button onClick={() => { setUser(null); try { localStorage.removeItem("q26_user"); } catch {} }} className="text-slate-600 hover:text-slate-400 text-xs px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-all">salir</button>
            </div>
          </div>

          {/* Phase pills */}
          <div className="flex gap-1.5 pb-3 overflow-x-auto">
            {Object.entries(PHASES).map(([k, ph]) => (
              <button key={k} onClick={() => setCurrentPhase(k)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-bold transition-all border ${currentPhase === k ? "bg-emerald-500 text-white border-emerald-400" : "border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"}`}>
                {ph.emoji} {ph.multiplier}x
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 pb-2 overflow-x-auto">
        {TABS.map(t => (
  <button key={t.id} onClick={() => {
    setTab(t.id);
    if (t.id === "partidos") setCurrentPhase(getCurrentPhase());
  }}
    className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? "bg-slate-700 text-white" : "text-slate-600 hover:text-slate-400"}`}>
    {t.label}
  </button>
))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

        {tab === "tabla" && (
          <>
            {!user.isAdmin && new Date() < new Date("2026-06-14T23:59:00-04:00") && !specials[user.id]?.campeon && (
              <div className="bg-amber-950/40 border border-amber-700/50 rounded-2xl p-4" onClick={() => setTab("especiales")}>
                <p className="text-amber-400 font-bold text-sm">⚠️ Llena tu quiniela antes del primer partido!</p>
                <p className="text-slate-400 text-xs mt-1">1. Ve a Especiales — elige campeon, subcampeon y goleador (60 pts en juego). 2. Ve a Partidos — llena los 72 partidos de la fase de grupos. Se bloquean al pitazo de cada partido!</p>
              </div>
            )}
            <Leaderboard participants={participants} scores={scores} currentPhase={currentPhase} currentUser={user} />
          </>
        )}

        {tab === "partidos" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">{PHASES[currentPhase]?.emoji} {PHASES[currentPhase]?.label}</h3>
              <Pill color={PHASES[currentPhase]?.color}>{PHASES[currentPhase]?.multiplier}x puntos</Pill>
            </div>

            {/* Group filter — only for group stage */}
            {currentPhase === "grupos" && (
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={() => setSelectedGroup("all")}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-all ${selectedGroup === "all" ? "bg-emerald-500 text-white border-emerald-400" : "border-slate-700 text-slate-500 hover:text-white"}`}>
                  Todos
                </button>
                {["A","B","C","D","E","F","G","H","I","J","K","L"].map(g => (
                  <button key={g} onClick={() => setSelectedGroup(g)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-all ${selectedGroup === g ? "bg-emerald-500 text-white border-emerald-400" : "border-slate-700 text-slate-500 hover:text-white"}`}>
                    Grupo {g}
                  </button>
                ))}
              </div>
            )}

            {phaseMatches.length === 0 && (
              <div className="text-center py-16 text-slate-600">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm">Los partidos de esta fase aparecerán pronto</p>
              </div>
            )}
          {phaseMatches.map(m => (
  <div key={m.id} id={m.id === nextMatchId ? "next-match" : undefined}>
    <MatchCard match={m} user={meAsParticipant || user}
      prediction={predictions[`${user.id}::${m.id}`]}
      onPredict={handlePredict} onSetResult={handleSetResult}
      isAdmin={user.isAdmin}
      participants={participants} allPredictions={predictions} />
  </div>
))}
        </div>
        )}
        {tab === "llaves" && (
          <div className="space-y-5">
            {/* Groups overview */}
            <div>
              <h3 className="text-white font-bold text-lg mb-3">🌍 Los 12 Grupos</h3>
              <div className="grid grid-cols-2 gap-2">
                {["A","B","C","D","E","F","G","H","I","J","K","L"].map(g => {
                  const gMatches = matches.filter(m => m.group === g);
                  const played = gMatches.filter(m => m.played).length;
                  return (
                    <div key={g} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-black text-sm">Grupo {g}</span>
                        <span className="text-slate-600 text-xs">{played}/{gMatches.length} jugs</span>
                      </div>
                      <div className="space-y-1">
                        {gMatches.slice(0,3).map((m,i) => {
                          const isHome = i === 0;
                          const team = isHome ? m.home : m.away;
                          const flag = isHome ? m.homeFlag : m.awayFlag;
                          return null;
                        })}
                        {/* Show unique teams in group */}
                        {Array.from(new Set([
                          ...gMatches.map(m => m.home + "|" + m.homeFlag),
                          ...gMatches.map(m => m.away + "|" + m.awayFlag)
                        ])).filter(t => !t.startsWith("Por def.|") && !t.startsWith("1°") && !t.startsWith("2°")).slice(0,4).map(t => {
                          const [name, flag] = t.split("|");
                          const wins = gMatches.filter(m => m.played && ((m.home===name && m.homeScore>m.awayScore)||(m.away===name && m.awayScore>m.homeScore))).length;
                          const draws = gMatches.filter(m => m.played && ((m.home===name||m.away===name) && m.homeScore===m.awayScore)).length;
                          const losses = gMatches.filter(m => m.played && ((m.home===name && m.homeScore<m.awayScore)||(m.away===name && m.awayScore<m.homeScore))).length;
                          const pts = wins*3 + draws;
                          const played2 = wins+draws+losses;
                          return (
                            <div key={name} className="flex items-center gap-1.5 text-xs">
                              <span>{flag}</span>
                              <span className="text-slate-300 flex-1 truncate">{name}</span>
                              {played2 > 0 && <span className="text-emerald-400 font-bold">{pts}pts</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Knockout bracket */}
            <div>
              <h3 className="text-white font-bold text-lg mb-3">⚡ Llaves de Eliminación</h3>

              {/* Octavos */}
              <div className="mb-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Octavos de Final · 2x</p>
                <div className="grid grid-cols-1 gap-2">
                  {matches.filter(m => m.phase === "octavos").map(m => (
                    <div key={m.id} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${m.played ? "bg-sky-900/20 border-sky-800/40" : "bg-slate-900/40 border-slate-800"}`}>
                      <span className="text-slate-600 text-xs w-6">{m.bracket}</span>
                      <span className="text-base">{m.homeFlag}</span>
                      <span className={`text-xs flex-1 ${m.played ? "text-white font-semibold" : "text-slate-400"}`}>{m.home}</span>
                      {m.played
                        ? <span className="text-white font-black text-sm mx-1">{m.homeScore}–{m.awayScore}</span>
                        : <span className="text-slate-700 text-xs mx-1">vs</span>}
                      <span className={`text-xs flex-1 text-right ${m.played ? "text-white font-semibold" : "text-slate-400"}`}>{m.away}</span>
                      <span className="text-base">{m.awayFlag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuartos */}
              <div className="mb-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Cuartos de Final · 3x</p>
                <div className="grid grid-cols-1 gap-2">
                  {matches.filter(m => m.phase === "cuartos").map(m => (
                    <div key={m.id} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${m.played ? "bg-orange-900/20 border-orange-800/40" : "bg-slate-900/40 border-slate-800"}`}>
                      <span className="text-slate-600 text-xs w-8">{m.bracket}</span>
                      <span className={`text-xs flex-1 ${m.played ? "text-white font-semibold" : "text-slate-400"}`}>{m.home}</span>
                      {m.played
                        ? <span className="text-white font-black text-sm mx-2">{m.homeScore}–{m.awayScore}</span>
                        : <span className="text-slate-700 text-xs mx-2">vs</span>}
                      <span className={`text-xs flex-1 text-right ${m.played ? "text-white font-semibold" : "text-slate-400"}`}>{m.away}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semis */}
              <div className="mb-4">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Semifinales · 5x</p>
                <div className="grid grid-cols-1 gap-2">
                  {matches.filter(m => m.phase === "semis").map(m => (
                    <div key={m.id} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${m.played ? "bg-violet-900/20 border-violet-800/40" : "bg-slate-900/40 border-slate-800"}`}>
                      <span className="text-slate-600 text-xs w-8">{m.bracket}</span>
                      <span className={`text-xs flex-1 ${m.played ? "text-white font-semibold" : "text-slate-400"}`}>{m.home}</span>
                      {m.played
                        ? <span className="text-white font-black text-sm mx-2">{m.homeScore}–{m.awayScore}</span>
                        : <span className="text-slate-700 text-xs mx-2">vs</span>}
                      <span className={`text-xs flex-1 text-right ${m.played ? "text-white font-semibold" : "text-slate-400"}`}>{m.away}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final */}
              <div>
                <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">👑 Gran Final · 10x · 26 Jul</p>
                {matches.filter(m => m.phase === "final").map(m => (
                  <div key={m.id} className={`rounded-2xl px-4 py-4 border ${m.played ? "bg-amber-900/20 border-amber-700/50" : "bg-slate-900/40 border-amber-800/20"}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <div className="text-3xl mb-1">{m.homeFlag}</div>
                        <p className={`text-sm font-bold ${m.played ? "text-white" : "text-slate-500"}`}>{m.home}</p>
                      </div>
                      <div className="text-center px-4">
                        {m.played
                          ? <p className="text-white font-black text-3xl">{m.homeScore}–{m.awayScore}</p>
                          : <p className="text-amber-700 font-black text-lg">FINAL</p>}
                        <p className="text-slate-600 text-xs mt-1">MetLife Stadium</p>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-3xl mb-1">{m.awayFlag}</div>
                        <p className={`text-sm font-bold ${m.played ? "text-white" : "text-slate-500"}`}>{m.away}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "especiales" && !user.isAdmin && (
          <SpecialPreds user={user} specials={specials} onSave={handleSaveSpecial} />
        )}

        {tab === "comodin" && !user.isAdmin && (
          <JokerPanel user={meAsParticipant || user} matches={matches}
            currentPhase={currentPhase} onUseJoker={handleUseJoker} />
        )}

        {tab === "mensajes" && (
          <AIMessages participants={participants} matches={matches} scores={scores} isAdmin={user.isAdmin} predictions={predictions} />
        )}

        {tab === "admin" && user.isAdmin && (
          <>
            {/* Live score toggle info */}
<div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-bold text-sm">🌐 Resultados en línea</p>
                  <p className="text-slate-500 text-xs mt-0.5">football-data.org</p>
                </div>
                <button onClick={async () => {
                  showToast("Consultando resultados...", "info");
                  try {
                    var r = await fetch("/api/scores");
                    var data = await r.json();
                    if (data.error) { showToast("Error: " + data.error, "err"); return; }
                    var nameMap = {"Mexico":"México","South Korea":"Corea del Sur","Czech Republic":"Rep. Checa","South Africa":"Sudáfrica","Canada":"Canadá","Bosnia and Herzegovina":"Bosnia y Herz.","Switzerland":"Suiza","Brazil":"Brasil","Morocco":"Marruecos","Haiti":"Haití","Scotland":"Escocia","United States":"EEUU","USA":"EEUU","Paraguay":"Paraguay","Australia":"Australia","Turkey":"Turquía","Türkiye":"Turquía","Germany":"Alemania","Curaçao":"Curazao","Ivory Coast":"Costa de Marfil","Ecuador":"Ecuador","Netherlands":"Países Bajos","Japan":"Japón","Sweden":"Suecia","Tunisia":"Túnez","Belgium":"Bélgica","Egypt":"Egipto","Iran":"Irán","New Zealand":"Nueva Zelanda","Spain":"España","Cape Verde":"Cabo Verde","Saudi Arabia":"Arabia Saudita","Uruguay":"Uruguay","France":"Francia","Senegal":"Senegal","Iraq":"Irak","Norway":"Noruega","Argentina":"Argentina","Algeria":"Argelia","Austria":"Austria","Jordan":"Jordania","Portugal":"Portugal","DR Congo":"RD Congo","Uzbekistan":"Uzbekistán","Colombia":"Colombia","England":"Inglaterra","Croatia":"Croacia","Ghana":"Ghana","Panama":"Panamá","Qatar":"Qatar"};
                    var updated = 0;
                    var newMatches = [...matches];
                    data.matches.forEach(function(fm) {
                      var home = nameMap[fm.homeTeam] || fm.homeTeam;
                      var away = nameMap[fm.awayTeam] || fm.awayTeam;
                      var idx = newMatches.findIndex(function(m) { return m.home === home && m.away === away && !m.played; });
                      if (idx > -1) {
                        newMatches[idx] = Object.assign({}, newMatches[idx], { homeScore: fm.homeScore, awayScore: fm.awayScore, played: true });
                        updated++;
                      }
                    });
                    if (updated > 0) {
                      setMatches(newMatches);
                      showToast("Actualizados " + updated + " resultados!", "ok");
                    } else {
                      showToast("No hay resultados nuevos", "info");
                    }
                  } catch(e) { showToast("Error de conexion", "err"); }
                }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                  Actualizar resultados
                </button>
              </div>
              <p className="text-slate-600 text-xs">Presiona para consultar resultados de partidos terminados</p>
            </div>
            <AdminPanel participants={participants} matches={matches}
              predictions={predictions} specials={specials} scores={scores} />
          </>
        )}

        {/* WhatsApp Share — Admin only */}
        {user.isAdmin && (
        <div className="py-4">
          <button onClick={shareWhatsApp}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20">
            <span className="text-lg">📲</span> Compartir
          </button>
          <p className="text-slate-700 text-xs text-center mt-2"> Copia la tabla y resultados para compartir</p>
        </div>
        )}

        {/* Footer */}
        <div className="text-center pt-2 pb-8">
          <p className="text-slate-800 text-xs">⚽ Quiniela Mundial 2026 · 🇺🇸🇲🇽🇨🇦</p>
        </div>
      </div>
    </div>
  );
}
