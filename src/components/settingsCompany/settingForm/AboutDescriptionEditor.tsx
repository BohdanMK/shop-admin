import { useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface AboutDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const AboutDescriptionEditor = ({ value, onChange }: AboutDescriptionEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({
        placeholder: "Введіть опис про компанію...",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "about-editor",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    const nextHtml = value || "";
    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const handleSetLink = () => {
    const currentLink = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Вставте посилання", currentLink ?? "https://");

    if (url === null) {
      return;
    }

    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  };

  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 1.5 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
        <Button size="small" variant={editor.isActive("bold") ? "contained" : "outlined"} onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button size="small" variant={editor.isActive("italic") ? "contained" : "outlined"} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button size="small" variant={editor.isActive("heading", { level: 2 }) ? "contained" : "outlined"} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Button>
        <Button size="small" variant={editor.isActive("bulletList") ? "contained" : "outlined"} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          UL
        </Button>
        <Button size="small" variant={editor.isActive("orderedList") ? "contained" : "outlined"} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          OL
        </Button>
        <Button size="small" variant={editor.isActive("link") ? "contained" : "outlined"} onClick={handleSetLink}>
          Link
        </Button>
        <Button size="small" variant="outlined" onClick={() => editor.chain().focus().unsetLink().run()}>
          Unlink
        </Button>
        <Button size="small" variant="outlined" onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </Button>
        <Button size="small" variant="outlined" onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </Button>
      </Stack>

      <Box
        sx={{
          minHeight: 180,
          "& .ProseMirror": {
            minHeight: 160,
            outline: "none",
            p: 1,
          },
          "& .ProseMirror p": {
            my: 0.75,
          },
          "& .ProseMirror p.is-editor-empty:first-of-type::before": {
            content: '"Введіть опис про компанію..."',
            color: "text.disabled",
            float: "left",
            height: 0,
            pointerEvents: "none",
          },
          "& .ProseMirror h2": {
            my: 1,
            fontSize: "1.25rem",
          },
          "& .ProseMirror ul, & .ProseMirror ol": {
            pl: 3,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default AboutDescriptionEditor;