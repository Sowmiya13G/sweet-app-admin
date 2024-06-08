import React, { useEffect, useState } from "react";

// mui components
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

// firebase
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// firebase service
import { db } from "../../firebaseConfig";

const Categories = () => {
  // local states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    name: "",
    imgSrc: "",
  });
  const [uploading, setUploading] = useState(false);

  // -------------------------------- USE EFFECTS --------------------------------
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const newItem = {
          id: "new-id",
          name: "Add New",
        };
        const updatedItems = [newItem, ...items];

        setCategories(updatedItems);

        console.log(updatedItems);
      },
      (error) => {
        console.error("Error fetching documents: ", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // -------------------------------- COMPONENT STYLES --------------------------------
  const scrollbarStyles = {
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: 0,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
    },
    "-ms-overflow-style": "none",
    "scrollbar-width": "none",
  };

  const gridItemStyles = {
    height: { xs: 100, md: 150 },
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "end",
    borderRadius: 2,
    width: { xs: 150, md: 200 },
    maxWidth: { xs: 150, md: 200 },
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const categoriesStyle = {
    minHeight: 250,
    display: "flex",
    alignItems: "start",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 2,
    width: "100%",
    padding: 2,
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    backgroundColor: "#22222e",
  };

  const iconContainerStyle = {
    width: "100%",
    height: { xs: 20, md: 40 },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    backgroundColor: "#d7d7d78a",
    color: "#000",
    fontSize: 30,
  };

  const textInputStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
      color: "white", // text color
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
    },
  };

  // -------------------------------- FUNCTIONALITIES --------------------------------

  // card click
  const handleCardClick = (category) => {
    setSelectedCategory(category);
    setEditedCategory(category);
    setEditMode(true);
  };

  // Category Name input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory((prev) => ({ ...prev, [name]: value }));
  };

  // upload image file for the category
  const handleFileChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let imgSrc = editedCategory.imgSrc;
      setUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `categories/${file.name}`);
      await uploadBytes(storageRef, file);
      imgSrc = await getDownloadURL(storageRef);
      setEditedCategory((prev) => ({ ...prev, imgSrc: imgSrc }));
      setUploading(false);
    }
  };

  // adding new category
  const handleAddChanges = async () => {
    if (selectedCategory && editedCategory.name.trim() !== "") {
      try {
        await addDoc(collection(db, "categories"), {
          name: editedCategory.name,
          imgSrc: editedCategory.imgSrc,
        });

        setEditMode(false);
      } catch (e) {
        console.error("Error updating document: ", e);
        setUploading(false);
      }
    }
  };

  // saving changes in existing category
  const handleSaveChanges = async () => {
    if (selectedCategory && editedCategory.name.trim() !== "") {
      try {
        const categoryDoc = doc(db, "categories", selectedCategory.id);
        await updateDoc(categoryDoc, {
          name: editedCategory.name,
          imgSrc: editedCategory.imgSrc,
        });

        setEditMode(false);
      } catch (e) {
        console.error("Error updating document: ", e);
        setUploading(false);
      }
    }
  };

  // deleting category
  const handleDelete = async () => {
    if (selectedCategory && selectedCategory.id !== "new-id") {
      try {
        const categoryDoc = doc(db, "categories", selectedCategory.id);
        await deleteDoc(categoryDoc);
        setEditMode(false);
        // setSelectedCategory(null);
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    }
  };

  // -------------------------------- RENDER UI --------------------------------
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 0, md: 2 },
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: "#fff", mt: 4 }}>
        Categories
      </Typography>
      <Box sx={{ ...scrollbarStyles }}>
        <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
          {categories.map((item) => (
            <Grid item key={item.id}>
              <Paper
                elevation={6}
                sx={{
                  ...gridItemStyles,
                  backgroundColor: "#fffeee",
                  color: "#000",
                  backgroundImage: `url(${
                    item.id === "new-id"
                      ? "https://firebasestorage.googleapis.com/v0/b/foodorder-ed990.appspot.com/o/categories%2F5034294.png?alt=media&token=a17391b7-effb-4dd5-b1c3-dad7bcc41d84"
                      : item.imgSrc
                  })`,
                }}
                onClick={() => handleCardClick(item)}
              >
                <Box sx={iconContainerStyle}>
                  <Typography
                    sx={{
                      fontSize: { xs: 15, md: 20 },
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      px: 2,
                    }}
                    noWrap={true}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      {editMode && selectedCategory && (
        <Box sx={categoriesStyle}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column" },
              justifyContent: "space-between",
              height: "100%",
              width: { xs: "100%", md: "30%" },
            }}
          >
            <TextField
              label="Enter Category Name"
              name="name"
              value={editedCategory.name}
              onChange={handleInputChange}
              margin="normal"
              sx={textInputStyle}
              error={editedCategory.name ? false : true}
            />
            <Box sx={{ my: 2 }}>
              {uploading ? (
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: 10,
                    borderRadius: 5,
                    // backgroundColor: "#d7d7d78a",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : editedCategory.imgSrc ? (
                <img
                  src={editedCategory.imgSrc}
                  width={"40%"}
                  height={"50%"}
                  style={{ borderRadius: 10 }}
                  alt="img"
                />
              ) : null}
            </Box>
            <Button
              variant="outlined"
              component="label"
              sx={{
                justifyContent: "space-between",
                display: "flex",
                height: 50,
                background: "transparent",
              }}
            >
              Upload File
              <CloudUploadIcon />
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
              alignItems: "end",
              justifyContent: "end",
              mb: 0,
              mt: 2,
            }}
          >
            {editedCategory?.id === "new-id" ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleAddChanges}
                sx={{
                  height: 40,
                }}
              >
                Add new
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSaveChanges}
                  sx={{
                    height: 40,
                    marginRight: "5px",
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  sx={{
                    height: 40,
                  }}
                >
                  Delete Category
                </Button>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Categories;
