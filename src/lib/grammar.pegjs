Flow
  = _ screens:Screen+ _ {
      return { version: "6.0", screens };
    }

// También permitir parsear una sola pantalla
SingleScreen
  = _ screen:Screen _ {
      return { version: "6.0", screens: [screen] };
    }

Screen
  = "Pantalla" _ id:Identifier ":" __ content:ScreenContent {
      return {
        id,
        title: id,
        layout: {
          type: "SingleColumnLayout",
          children: content
        }
      };
    }

ScreenContent
  = (Options / NonScreenText)*

Text
  = line:TextLine __ {
      return { type: "TextParagraph", text: line };
    }

// Texto que no sea "Pantalla" al inicio de línea
NonScreenText
  = !"Pantalla" line:TextLine __ {
      return { type: "TextParagraph", text: line };
    }

Options
  = "Opciones:" __ opts:OptionLine+ {
      return {
        type: "Options",
        items: opts
      };
    }

OptionLine
  = [0-9]+ "." _ text:TextLine __ {
      return { id: text.toLowerCase().replace(/ /g, "_"), title: text };
    }

Identifier
  = [A-Za-z0-9_]+ { return text(); }

TextLine
  = [^\n]+ { return text().trim(); }

_ = [ \t]*
__ = [ \t\r\n]*