import { ContentState, convertToRaw, convertFromHTML, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useEffect, useMemo, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useLoaderData, useSubmit, useLocation } from "react-router-dom";
import { debounce } from "@mui/material";

export default function Note() {
    const { note } = useLoaderData();
    const submit = useSubmit();
    const location = useLocation();
    const [editorState, setEditorState] = useState(() => {
        return EditorState.createEmpty();
    });

    const [rawHTML, setRawHTML] = useState(note.content);

    useEffect(() => {
        const blocksFromHTML = convertFromHTML(note.content);
        const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        setEditorState(EditorState.createWithContent(state));
    }, [note.id]);

    useEffect(() => {
        debounceMemorized(rawHTML, note, location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawHTML, location.pathname]);
    // Khi rawHTML thay đổi, tức là người dùng đã nhập vào editor, thì gọi hàm debounceMemorized để submit lên server
    // Khi location.pathname thay đổi, tức là người dùng đã chuyển trang, thì gọi hàm debounceMemorized để submit lên server 

    //Kỹ thuật debounce, giảm số lần gọi hàm, chỉ gọi sự kiện cuối cùng, ignore các sự kiện trước đó
    // Dùng useMemo hay useCallback để tránh tạo ra hàm mới mỗi lần render
    // useMemo và useCallback đều trả về giá trị được tính toán từ hàm callback
    // Chỉ khác nhau ở chỗ useMemo trả về giá trị được tính toán từ hàm callback, useCallback trả về hàm callback
    const debounceMemorized = useMemo(() => {
        return debounce((rawHTML, note, pathname) => {
            if (rawHTML === note.content) return;
            submit({ ...note, content: rawHTML }, { method: "post", action: pathname });
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setRawHTML(note.content);
    }, [note.content]);

    const handleOnChange = (e) => {
        setEditorState(e);
        setRawHTML(draftToHtml(convertToRaw(e.getCurrentContent())));
    };

    return (
        <Editor editorState={editorState} onEditorStateChange={handleOnChange} placeholder="Enter your note here..." />
    );
}
