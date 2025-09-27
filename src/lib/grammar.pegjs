{
  // Helpers en JS para reusar
  function makeId(text) {
    return text.toLowerCase().replace(/ /g, "_");
  }


  function makeScreenId(text) {
    // Si el texto tiene espacios, reemplazar con guiones bajos
    // Si no tiene espacios, usar tal como está
    if (text.includes(" ")) {
      return text.toLowerCase().replace(/ /g, "_");
    }
    return text;
  }

  function extractNavigationScreen(text) {
    // Buscar patrón "Ir a pantalla [Nombre]"
    const match = text.match(/Ir a pantalla\s+(.+)/i);
    if (match) {
      return makeScreenId(match[1].trim());
    }
    return null;
  }

  // Variables globales para tracking de IDs únicos
  var usedScreenIds = new Set();
  var usedListNames = new Set();
  var referencedScreens = new Set();
}

Flow
  = __ screens:Screen+ _ {
      // Validar que todas las pantallas referenciadas existan
      const existingScreenIds = new Set(screens.map(s => s.id));
      for (const referencedScreen of referencedScreens) {
        if (!existingScreenIds.has(referencedScreen)) {
          error("Error: La pantalla '" + referencedScreen + "' es referenciada pero no existe. Debe crear esta pantalla en el flujo.");
        }
      }
      return { version: "6.0", screens };
    }
  / __ screen:Screen _ {
      // Validar que todas las pantallas referenciadas existan
      const existingScreenIds = new Set([screen.id]);
      for (const referencedScreen of referencedScreens) {
        if (!existingScreenIds.has(referencedScreen)) {
          error("Error: La pantalla '" + referencedScreen + "' es referenciada pero no existe. Debe crear esta pantalla en el flujo.");
        }
      }
      return { version: "6.0", screens: [screen] };
    }
  / _ { error("Error: El DSL debe contener al menos una pantalla. Ejemplo: 'Pantalla Mi Pantalla:'"); }

// También permitir parsear una sola pantalla
SingleScreen
  = _ screen:Screen _ {
      return { version: "6.0", screens: [screen] };
    }

OptionalQuotedTitle
  = __ "\"" t:[^"]+ "\"" { return t.join("").trim(); }
  / "" { return null; }

Screen
  = __ "Pantalla" __ id:ScreenIdentifier title:OptionalQuotedTitle? ":" __ content:ScreenContent {
      const screenId = makeScreenId(id);
      
      // Validar ID único de pantalla
      if (usedScreenIds.has(screenId)) {
        error("Error: Ya existe una pantalla con el ID '" + screenId + "'. Los IDs de pantalla deben ser únicos.");
      }
      usedScreenIds.add(screenId);

      const dropdowns = content.filter(c => c.type === "Dropdown");
      const texts = content.filter(c => c.type === "TextParagraph");
      const titles = content.filter(c => c.type === "TextSubheading");
      
      // Buscar texto de navegación en los textos
      let nextScreenName = null;
      for (const text of texts) {
        const extractedScreen = extractNavigationScreen(text.text);
        if (extractedScreen) {
          nextScreenName = extractedScreen;
          break;
        }
      }

      // --- Sección DATA ---
      const data = {};
      dropdowns.forEach(d => {
        // Filtrar las opciones para __example__: solo mostrar enabled cuando es false
        const exampleOptions = d.options.map(option => {
          const filteredOption = {
            id: option.id,
            title: option.title
          };
          // Solo incluir enabled si es false
          if (option.enabled === false) {
            filteredOption.enabled = false;
          }
          return filteredOption;
        });

        data[d.name] = {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" }
            }
          },
          "__example__": exampleOptions
        };
      });

      // --- Sección LAYOUT ---
      const formChildren = dropdowns.map(d => ({
        type: "Dropdown",
        label: d.label,
        name: d.name,
        required: true, 
        "data-source": "${data." + d.name + "}"
      }));

      // Footer automático solo si hay navegación
      if (nextScreenName) {
        referencedScreens.add(nextScreenName);
        formChildren.push({
          type: "Footer",
          label: "Continuar",
          "on-click-action": {
            name: "navigate",
            next: { type: "screen", name: nextScreenName },
            payload: Object.fromEntries(
              dropdowns.map(d => [d.name, "${form." + d.name + "}"])
            )
          }
        });
      }

      // Construir children del layout manteniendo el orden original
      const layoutChildren = content
        .filter(c => c.type === "TextParagraph" || c.type === "TextSubheading" || c.type === "Image")
        .map(c => {
          if (c.type === "TextParagraph") {
            return { type: "TextBody", text: c.text };
          } else if (c.type === "TextSubheading") {
            return { type: "TextSubheading", text: c.text };
          } else if (c.type === "Image") {
            return { type: "Image", src: c.src, height: c.height };
          }
        });
      
      // Solo agregar Form si hay dropdowns o navegación
      if (dropdowns.length > 0 || nextScreenName) {
        layoutChildren.push({
          type: "Form",
          name: "form_agendamiento",
          children: formChildren
        });
      }

      return {
        id: screenId,
        title: title !== null ? title : ("Agendamiento de " + id),
        data,
        layout: {
          type: "SingleColumnLayout",
          children: layoutChildren
        }
      };
    }
  / _ "Pantalla" __ id:ScreenIdentifier !":" { error("Error de sintaxis: 'Pantalla' debe ir seguido de ':'. Ejemplo: 'Pantalla Mi Pantalla:'"); }

ScreenContent
  = (Lista / Titulo / Image / NonScreenText / InvalidOptionLine / InvalidKeywordLine)*

InvalidOptionLine
  = !"Pantalla" !"Lista" !"List" !"Lis" !"Listas" !"Pantala" !"Pantallas" !"Opcion" !"Optional" !"Opciones" !([0-9]+ ".") [^\n]+ { error("Error de sintaxis: Las opciones deben empezar con número y punto. Ejemplo: '1. Mi opción'"); }

// Detectar palabras clave mal escritas usando patrones similares
InvalidKeywordLine
  = "Lis" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Lista'. Ejemplo: 'Lista Mi Lista:'"); }
  / "List" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Lista'. Ejemplo: 'Lista Mi Lista:'"); }
  / "Listas" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Lista'. Ejemplo: 'Lista Mi Lista:'"); }
  / "Pantala" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Pantalla'. Ejemplo: 'Pantalla Mi Pantalla:'"); }
  / "Pantallas" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Pantalla'. Ejemplo: 'Pantalla Mi Pantalla:'"); }
  / "Opcion" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Opcional'. Ejemplo: 'Opcional: mi texto'"); }
  / "Optional" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Opcional'. Ejemplo: 'Opcional: mi texto'"); }
  / "Opciones" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Opcional'. Ejemplo: 'Opcional: mi texto'"); }
  / "Image" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Imagen'. Ejemplo: 'Imagen: mi imagen'"); }
  / "Titul" [^\n]* { error("Error de sintaxis: La palabra clave correcta es 'Titulo'. Ejemplo: 'Titulo: mi titulo'"); }

Text
  = line:TextLine __ {
      return { type: "TextParagraph", text: line };
    }
 Titulo
  = "Titulo" __ ":" __ title:TextLine __ {
      return { type: "TextSubheading", text: title };
    }

Image
  = "Imagen" __ ":" __ src:QuotedTitle __ height:ImageHeight? __ {
      // Si es una URL de R2, mantenerla para conversión posterior
      // Si es base64, usar directamente
      return { 
        type: "Image", 
        src: src,
        height: height || 150
      };
    }

ImageHeight
  = [0-9]+ { return parseInt(text(), 10); }

// Texto que no sea "Pantalla" o "Lista" al inicio de línea
NonScreenText
  = !"Pantalla" !"Lista" !"List" !"Lis" !"Listas" !"Pantala" !"Pantallas" !"Opcion" !"Optional" !"Opciones" line:TextLine __ {
      return { type: "TextParagraph", text: line };
    }


// Una lista solo devuelve metadata para que Screen lo use
Lista
  = "Lista" __ name:ListName ":" __ opts:OptionLine+ {
      const listName = makeScreenId(name).toLowerCase();
      
      // Validar nombre único de lista
      if (usedListNames.has(listName)) {
        error("Error: Ya existe una lista con el nombre '" + listName + "'. Los nombres de lista deben ser únicos.");
      }
      usedListNames.add(listName);

      return {
        type: "Dropdown",
        name: listName,
        label: "Seleccione " + name,
        required: true, 
        options: opts.map(o => ({
          id: o.id,
          title: o.title,
          enabled: o.enabled !== undefined ? o.enabled : true
        }))
      };
    }
  / "Lista" __ name:ListName __ title:QuotedTitle ":" __ opts:OptionLine+ {
      const listName = makeScreenId(name).toLowerCase();
      
      // Validar nombre único de lista
      if (usedListNames.has(listName)) {
        error("Error: Ya existe una lista con el nombre '" + listName + "'. Los nombres de lista deben ser únicos.");
      }
      usedListNames.add(listName);

      return {
        type: "Dropdown",
        name: listName,
        label: title,
        required: true, 
        options: opts.map(o => ({
          id: o.id,
          title: o.title,
          enabled: o.enabled !== undefined ? o.enabled : true
        }))
      };
    }
  / "Lista" __ name:ListName !":" { error("Error de sintaxis: 'Lista' debe ir seguido de ':'. Ejemplo: 'Lista Mi Lista:'"); }


/* ----------- UTILS ----------- */
OptionalRequerido
  = "Requerido" _ ":" { return true; }
  / "" { return false; }

ListName
  = [A-Za-z0-9_ ]+ { 
      const name = text().trim();
      if (name.length === 0) {
        error("Error de sintaxis: El nombre de la lista no puede estar vacío");
      }
      return name;
    }

QuotedTitle
  = "\"" t:[^"]+ "\"" { return t.join("").trim(); }
  / "\"" t:[^"]* { error("Error de sintaxis: Las comillas no están cerradas correctamente. Ejemplo: '\"Mi Título\"'"); }

OptionLine
  = [0-9]+ "." _ opt:OptionalHabilitado? option:DashOption __ {
      return {
        id: option.id,
        title: option.title,
        enabled: opt !== null ? opt : true
      };
    }
  / [0-9]+ "." _ opt:OptionalHabilitado? text:ValidTextLine __ {
      return {
        id: makeScreenId(text),
        title: text,
        enabled: opt !== null ? opt : true
      };
    }


DashOption
  = id:OptionId _ "-" _ title:OptionTitle {
      return {
        id: makeId(id),
        title: title
      };
    }

OptionId
  = [A-Za-z0-9_ ]+ { return text().trim(); }

OptionTitle
  = [^\n]+ { return text().trim(); }

OptionalHabilitado
  = "Opcional" ":" _ { return false; }
  / "Opcional" !":" { error("Se esperaba ':' después de 'Opcional'. Ejemplo correcto: 'Opcional: texto'"); }

/* ----------- UTILS ------------- */
Identifier
  = [A-Za-z0-9_]+ { return text(); }

ScreenIdentifier
  = [A-Za-z0-9_ ]+ { return text().trim(); }

TextLine
  = [^\n]+ { return text().trim(); }

ValidTextLine
  = !"Opcional" !([A-Za-z0-9_]+ _ "-") [^\n]+ { return text().trim(); }
  / "Opcional" !":" [^\n]* { error("Error de sintaxis: 'Opcional' debe ir seguido de ':'. Ejemplo: 'Opcional: mi texto'"); }

_  = [ \t]*
__ = [ \t\r\n]*
