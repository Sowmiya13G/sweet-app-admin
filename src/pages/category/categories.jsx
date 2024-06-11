import React, { useEffect, useState } from "react";

// mui components
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RamenDiningRoundedIcon from "@mui/icons-material/RamenDiningRounded";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
// firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// firebase service
import { db } from "../../firebaseConfig";

const Categories = () => {
  // local states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [foodImgUploading, setFoodImgUploading] = useState(false);
  const [foodList, setFoodList] = useState([]);
  const [editedCategory, setEditedCategory] = useState({
    name: "",
    imgSrc: "",
  });
  const [foodDetails, setFoodDetails] = useState({
    category: "",
    dishName: "",
    price: "",
    imgSrc: "",
    offerAvailable: "",
    type: "",
    offer: "",
  });
  const [showEditFields, setShowEditFields] = useState(true);
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedFoodDetails, setSelectedFoodDetails] = useState(null);
  
  // variables
  const filteredFoodList = foodList.filter(
    (food) => food.category === selectedCategory?.name
  );

  const isShowEditFields = editedCategory?.id !== "new-id" && selectedCategory;

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

        // Select the first category initially
        if (updatedItems.length > 0) {
          handleCardClick(updatedItems[1]);
        }
      },
      (error) => {
        console.error("Error fetching documents: ", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const ordersCollection = collection(db, "foodList");
        const unsubscribe = onSnapshot(ordersCollection, (orderSnapshot) => {
          const ordersList = orderSnapshot.docs.map((doc) => doc.data());
          setFoodList(ordersList);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
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
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    minHeight: 500,
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
      "&.Mui-focused fieldset": {
        borderColor: "initial", // Keeps the border color initial (default)
        // Optional: remove the box-shadow to prevent blue outline
        boxShadow: "none",
      },
    },
  };

  const iconStyle = {
    fontSize: 40,
    marginBottom: 1,
  };

  const foodGridStyles = {
    minHeight: { xs: 60, md: 50 },
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    borderRadius: 2,
    padding: 2,
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    with: "100%",
    backgroundColor: "#ffffff",
    height: 500,
  };

  const foodItemStyle = {
    width: "100%",
    height: { xs: 60, md: 60 },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    backgroundColor: "#d7d7d78a",
    color: "#000",
    fontSize: 30,

    // borderLeftColor: Boolean(selectedCard) ? "#000" : "#fff",
    // borderLeftWidth: "100px",
  };

  const scrollVerbarStyles = {
    overflowY: "auto",
    width: "100%",

    // overflowX: "auto",
    "&::-webkit-scrollbar": {
      height: 0,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
    },
    "-ms-overflow-style": "none", // IE and Edge
    "scrollbar-width": "none", // Firefox
  };

  // -------------------------------- FUNCTIONALITIES --------------------------------

  // card click
  const handleCardClick = (category) => {
    setSelectedCategory(category);
    setEditedCategory(category);
    setEditMode(true);

    // Reset form
    setFoodDetails({
      category: "",
      dishName: "",
      price: "",
      img: "",
      type: "",
      offer: "",
    });
    setSelectedFoodDetails(null);
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
      } catch (e) {
        console.error("Error deleting document: ", e);
      }
    }
  };

  // food details input change
  const handleFoodInputChange = (e) => {
    const { name, value } = e.target;
    setFoodDetails((prev) => ({ ...prev, [name]: value }));
  };

  // upload image file for the food item
  const handleFoodFileChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      let imgSrc = foodDetails.imgSrc;
      setFoodImgUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `foodList/${file.name}`);
      await uploadBytes(storageRef, file);
      imgSrc = await getDownloadURL(storageRef);
      setFoodDetails((prev) => ({ ...prev, imgSrc: imgSrc }));
      setFoodImgUploading(false);
    }
  };

  // adding food item under selected category
  const handleAddFoodItem = async () => {
    if (
      selectedCategory &&
      foodDetails.name?.trim() !== "" &&
      foodDetails.price?.trim() !== ""
    ) {
      try {
        await addDoc(collection(db, "foodList"), {
          categoryId: selectedCategory?.id,
          category: selectedCategory?.name,
          dishName: foodDetails.dishName,
          price: foodDetails.price,
          img: foodDetails.imgSrc,
          type: foodDetails.type,
          offer: foodDetails.offer,
        });

        // Reset form
        setFoodDetails({
          category: "",
          dishName: "",
          price: "",
          img: "",
          type: "",
          offer: "",
        });
        // setShowEditFields(false);
      } catch (e) {
        console.error("Error adding food item: ", e);
        setUploading(false);
      }
    }
  };

  const handleFoodCardClick = (food) => {
    setSelectedCard(food.dishName);
    setFoodDetails(food);
    setSelectedFoodDetails(food);
  };

  // delete food item
  const handleDeleteFood = async () => {
    if (selectedCard) {
      try {
        await deleteDoc(doc(db, "foodList", selectedCard));
        setSelectedCard(null);
      } catch (e) {
        console.error("Error deleting food item: ", e);
      }
    }
  };

  // -------------------------------- RENDER UI --------------------------------

  const renderAddFoodFields = () => {
    return (
      <>
        {showEditFields && selectedCategory && (
          <Box
            sx={{
              ...categoriesStyle,
            }}
          >
            <Typography
              gutterBottom
              sx={{ color: "#000", fontSize: 20, fontWeight: 600 }}
            >
              Add Food Item Under {selectedCategory.name}
            </Typography>
            <Divider
              sx={{
                backgroundColor: "#00000090",
                width: "100%",
                my: 1,
                mb: 2,
              }}
            />
            <TextField
              label="Category"
              name="category"
              value={selectedCategory?.name}
              onChange={handleFoodInputChange}
              fullWidth
              sx={{ mb: 2, ...textInputStyle }}
            />
            <TextField
              label="Food Name"
              name="dishName"
              value={foodDetails.dishName}
              onChange={handleFoodInputChange}
              fullWidth
              sx={{ mb: 2, ...textInputStyle }}
            />
            <TextField
              label="Price"
              name="price"
              value={foodDetails.price}
              onChange={handleFoodInputChange}
              fullWidth
              sx={{ mb: 2, ...textInputStyle }}
            />

            <TextField
              select
              label="Offer available"
              name="offerAvailable"
              value={foodDetails.offerAvailable}
              onChange={handleFoodInputChange}
              fullWidth
              sx={{ mb: 2, ...textInputStyle }}
            >
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
            </TextField>
            {foodDetails.offerAvailable == "yes" && (
              <>
                <TextField
                  label="Offer Type"
                  name="type"
                  value={foodDetails.type}
                  onChange={handleFoodInputChange}
                  fullWidth
                  sx={{ mb: 2, ...textInputStyle }}
                />
                <TextField
                  label="Offer"
                  name="offer"
                  value={foodDetails.offer}
                  onChange={handleFoodInputChange}
                  fullWidth
                  sx={{ mb: 2, ...textInputStyle }}
                />
              </>
            )}
            <Box sx={{ my: 2, width: 200, height: 200 }}>
              {foodImgUploading ? (
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: 10,
                    borderRadius: 5,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                foodDetails.imgSrc && (
                  <img
                    src={foodDetails.imgSrc}
                    width={"100%"}
                    height={"100%"}
                    style={{ borderRadius: 10 }}
                    alt="img"
                  />
                )
              )}
            </Box>
            <Button
              variant="outlined"
              component="label"
              sx={{
                justifyContent: "space-between",
                display: "flex",
                height: 50,
                background: "transparent",
                marginBottom: "10px",
              }}
            >
              Upload File
              <CloudUploadIcon />
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={handleFoodFileChange}
              />
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddFoodItem}
              sx={{
                height: 40,
                marginBottom: "10px",
                width: "45%",
                display: "flex",
                alignSelf: "flex-end",
              }}
            >
              Add Food
            </Button>
          </Box>
        )}
      </>
    );
  };

  const editCategoryFields = () => {
    return (
      <Box sx={categoriesStyle}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column" },
            justifyContent: "space-between",
            // height: "100%",
          }}
        >
          <TextField
            label="Enter Category Name"
            name="name"
            value={editedCategory.name}
            onChange={handleInputChange}
            margin="normal"
            sx={textInputStyle}
            error={!editedCategory.name}
          />

          <Box sx={{ my: 2, width: 200, height: 200 }}>
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
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              editedCategory.imgSrc && (
                <img
                  src={editedCategory.imgSrc}
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: 10 }}
                  alt="img"
                />
              )
            )}
          </Box>
          <Button
            variant="outlined"
            component="label"
            sx={{
              justifyContent: "space-between",
              display: "flex",
              height: 50,
              background: "transparent",
              marginBottom: "10px",
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
        {editedCategory?.id === "new-id" ? (
          <Button
            variant="contained"
            color="success"
            onClick={handleAddChanges}
            sx={{
              height: 40,
              width: "40%",
            }}
          >
            Add new
          </Button>
        ) : (
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                height: 40,
                width: "40%",
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveChanges}
              sx={{
                height: 40,
                marginBottom: "10px",
                width: "40%",
              }}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const foodListBox = () => {
    return (
      <Paper
        elevation={6}
        sx={{
          ...foodGridStyles,
        }}
      >
        {filteredFoodList.length > 0 ? (
          <>
            <Box
              sx={{
                flexDirection: "row",
                justifyItems: "space-between",
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "#000",
                }}
              >
                Food List
              </Typography>

              <Button
                onClick={() => {
                  setShowEditFields(true);
                  // Reset form
                  setFoodDetails({
                    category: "",
                    dishName: "",
                    price: "",
                    img: "",
                    type: "",
                    offer: "",
                  });
                }}
              >
                <AddIcon style={{ color: "#000" }} />
              </Button>
            </Box>
            <Divider
              sx={{ backgroundColor: "#00000090", width: "100%", mb: 2 }}
            />
            <Box sx={{ ...scrollVerbarStyles }}>
              {filteredFoodList.map((food, index) => (
                <Grid
                  item
                  key={food.id}
                  xs={6}
                  md={3}
                  onClick={() => handleFoodCardClick(food)}
                >
                  <Paper
                    key={index}
                    sx={{
                      ...foodItemStyle,
                      justifyContent: "space-between",
                      px: 2,
                      marginBottom: "5px",
                      borderLeft:
                        selectedCard === food.dishName
                          ? "5px solid #22222E"
                          : "none",
                    }}
                  >
                    <Box
                      sx={{
                        flexDirection: "column",
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                        Dish Name: {food.name}
                      </Typography>
                      <Typography sx={{ fontWeight: "bold", fontSize: 16 }}>
                        Price: {food.price}
                      </Typography>
                    </Box>
                    <RamenDiningRoundedIcon
                      sx={{ ...iconStyle, color: "#626fa0" }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Box>
          </>
        ) : (
          <>
            <Typography
              gutterBottom
              sx={{ color: "#000", fontSize: 20, fontWeight: 600 }}
            >
              No Foods added in list
            </Typography>
          </>
        )}
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 0, md: 2 },
      }}
    >
      {/* --------------------- CATEGORIES BOX --------------------- */}
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

      {/* --------------------- CATEGORIES BOX --------------------- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          width: "100%",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {editMode && selectedCategory && (
          <Box sx={{ width: { xs: "100%", md: "29%" }, my: 1 }}>
            {editCategoryFields()}
          </Box>
        )}
        {editedCategory?.id !== "new-id" && (
          <Box sx={{ width: { xs: "100%", md: "29%" }, my: 1 }}>
            {foodListBox()}
          </Box>
        )}
        {isShowEditFields && (
          <Box sx={{ width: { xs: "100%", md: "39%" }, my: 1 }}>
            {renderAddFoodFields()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Categories;
