import { CreateNewFolderOutlined } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addNewFolder } from "../utils/folderUtils";

export default function NewFolder() {
    const [newFolderName, setNewFolderName] = useState("");
    const [open, setOpen] = useState(false); // Mặc định popup sẽ ở trạng thái đóng
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const popupName = searchParams.get("popup");

    const handleOpenPopup = () => {
        setSearchParams({ popup: "add-folder" });
    };
    const handleClose = () => {
        setNewFolderName("");
        navigate(-1); // Trở về trang trước đó, khi đó sẽ tải lại trang
    };
    const handleNewFolderNameChange = (e) => {
        setNewFolderName(e.target.value);
    };
    const handleAddNewFolder = async () => {
        const { addFolder } = await addNewFolder({ name: newFolderName });
        console.log({ addFolder });
        handleClose();
    };

    useEffect(() => {
        if (popupName === "add-folder") {
            setOpen(true);
            return;
        }
        setOpen(false);
    }, [popupName]);

    return (
        <div>
            <Tooltip title="Add Folder" onClick={handleOpenPopup}>
                <IconButton size="small">
                    <CreateNewFolderOutlined sx={{ color: "white" }} />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus // Tự động focus vào ô input khi mở popup
                        margin="dense" // Khoảng cách giữa các thành phần, dense là khoảng cách nhỏ
                        id="name"
                        label="Folder Name"
                        fullWidth // Độ rộng của ô input sẽ chiếm hết chiều rộng của Dialog
                        size="small"
                        variant="standard" // Kiểu của ô input, standard là kiểu bình thường
                        sx={{ width: "400px" }}
                        autoComplete="off" // Tắt tính năng gợi ý của trình duyệt
                        value={newFolderName}
                        onChange={handleNewFolderNameChange}
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddNewFolder}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
