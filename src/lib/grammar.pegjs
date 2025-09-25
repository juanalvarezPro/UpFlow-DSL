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

  // Variables globales para tracking de IDs únicos
  var usedScreenIds = new Set();
  var usedListNames = new Set();
}

Flow
  = _ screens:Screen+ _ {
      return { version: "6.0", screens };
    }
  / _ screen:Screen _ {
      return { version: "6.0", screens: [screen] };
    }

// También permitir parsear una sola pantalla
SingleScreen
  = _ screen:Screen _ {
      return { version: "6.0", screens: [screen] };
    }

OptionalQuotedTitle
  = __ "\"" t:[^"]+ "\"" { return t.join("").trim(); }
  / "" { return null; }

Screen
  = "Pantalla" _ id:ScreenIdentifier title:OptionalQuotedTitle? ":" __ content:ScreenContent {
      const screenId = makeScreenId(id);
      
      // Validar ID único de pantalla
      if (usedScreenIds.has(screenId)) {
        error("Error: Ya existe una pantalla con el ID '" + screenId + "'. Los IDs de pantalla deben ser únicos.");
      }
      usedScreenIds.add(screenId);

      const dropdowns = content.filter(c => c.type === "Dropdown");
      const texts = content.filter(c => c.type === "TextParagraph");

      // --- Sección DATA ---
      const data = {};
      dropdowns.forEach(d => {
        data[d.name] = {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" }
            }
          },
          "__example__": d.options
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

      // Footer automático
      formChildren.push({
        type: "Footer",
        label: "Continuar",
        "on-click-action": {
          name: "navigate",
          next: { type: "screen", name: "DETALLES" },
          payload: Object.fromEntries(
            dropdowns.map(d => [d.name, "${form." + d.name + "}"])
          )
        }
      });

      return {
        id: screenId,
        title: title !== null ? title : ("Agendamiento de " + id),
        data,
        layout: {
          type: "SingleColumnLayout",
          children: [
            ...texts.map(t => ({ type: "TextBody", text: t.text })),
            {
              type: "Form",
              name: "form_agendamiento",
              children: formChildren
            }
          ]
        }
      };
    }
  / "Pantalla" _ id:ScreenIdentifier !":" { error("Error de sintaxis: 'Pantalla' debe ir seguido de ':'. Ejemplo: 'Pantalla Mi Pantalla:'"); }

ScreenContent
  = (Lista / NonScreenText / InvalidOptionLine)*

InvalidOptionLine
  = !"Pantalla" !"Lista" !([0-9]+ ".") [^\n]+ { error("Error de sintaxis: Las opciones deben empezar con número y punto. Ejemplo: '1. Mi opción'"); }

Text
  = line:TextLine __ {
      return { type: "TextParagraph", text: line };
    }

// Texto que no sea "Pantalla" o "Lista" al inicio de línea
NonScreenText
  = !"Pantalla" !"Lista" line:TextLine __ {
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
          id: makeScreenId(o.title),
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
          id: makeScreenId(o.title),
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
  = [0-9]+ "." _ opt:OptionalHabilitado? text:ValidTextLine __ {
      return {
        id: makeScreenId(text),
        title: text,
        enabled: opt !== null ? opt : true
      };
    }

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
  = !"Opcional" [^\n]+ { return text().trim(); }
  / "Opcional" !":" [^\n]* { error("Error de sintaxis: 'Opcional' debe ir seguido de ':'. Ejemplo: 'Opcional: mi texto'"); }

_  = [ \t]*
__ = [ \t\r\n]*
