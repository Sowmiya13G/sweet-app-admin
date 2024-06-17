import React, { useEffect, useState } from "react";

// mui components
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Checkbox,
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

// component
import TabBar from "../../components/tabBar/tabBar";

// icons
import nonVegIcon from "../../assets/images/nonVeg.png";
import vegIcon from "../../assets/images/veg.png";
import plusIcon from "../../assets/images/plus.png";

const Categories = () => {
  const tabs = [
    { tbName: "All", id: 1 },
    { tbName: "Veg", id: 2 },
    { tbName: "Non-Veg", id: 3 },
  ];
  // local states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [foodImgUploading, setFoodImgUploading] = useState(false);
  const [foodList, setFoodList] = useState([]);
  const [editedCategory, setEditedCategory] = useState({
    name: "",
    img: "",
  });
  const [foodDetails, setFoodDetails] = useState({
    category: "",
    dishName: "",
    price: "",
    categorized: "",
    img: "",
  });
  const [showEditFields, setShowEditFields] = useState(true);
  const [addNewFoodList, setAddNewFoodList] = useState(true);
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");

  // variables
  const filteredFoodList = foodList.filter(
    (food) => food.category === selectedCategory?.name
  );

  const isShowEditFields = editedCategory?.id !== "new-id" && selectedCategory;

  const filteredFoodListByTab =
    selectedTab === "All"
      ? filteredFoodList
      : filteredFoodList.filter(
          (food) =>
            food.categorized === (selectedTab === "Veg" ? "veg" : "non-veg")
        );
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
          const ordersList = orderSnapshot.docs.map((doc) => ({
            id: doc.id, // Store document ID
            ...doc.data(), // Include document data
          }));
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
    height: { xs: 100, md: 130 },
    display: "flex",
    flexDirection: "column",
    color: "#000",
    backgroundColor: "#fff",
    padding: 1,
    alignItems: "center",
    justifyContent: "end",
    borderRadius: 2,
    width: { xs: 150, md: 150 },
    maxWidth: { xs: 150, md: 200 },
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
  };

  const categoriesStyle = {
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    width: "100%",
    backgroundColor: "#00000001",
    padding: "15px",
    borderRadius: "10px",
    minHeight: 300,
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
    backgroundColor: "#00000001",
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
    transition:
      "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-left 0.2s ease-in-out",
    ":hover": {
      background: "#00000030",
    },

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
      categorized: "",
      img: "",
    });
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
      let img = editedCategory.img;
      setUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `categories/${file.name}`);
      await uploadBytes(storageRef, file);
      img = await getDownloadURL(storageRef);
      setEditedCategory((prev) => ({ ...prev, img: img }));
      setUploading(false);
    }
  };

  // adding new category
  const handleAddChanges = async () => {
    if (selectedCategory && editedCategory.name.trim() !== "") {
      try {
        await addDoc(collection(db, "categories"), {
          name: editedCategory.name,
          imgSrc: editedCategory.img,
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
          imgSrc: editedCategory.img,
        });

        // setEditMode(false);
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
      let img = foodDetails.img;
      setFoodImgUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `foodList/${file.name}`);
      await uploadBytes(storageRef, file);
      img = await getDownloadURL(storageRef);
      setFoodDetails((prev) => ({ ...prev, img: img }));
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
          categorized: foodDetails.categorized,
          price: foodDetails.price,
          img: foodDetails.img,
          isSoldOut: false,
        });

        // Reset form
        setFoodDetails({
          category: "",
          dishName: "",
          price: "",
          categorized: "",
          img: "",
        });
        // setShowEditFields(false);
      } catch (e) {
        console.error("Error adding food item: ", e);
        setUploading(false);
      }
    } else {
      console.error("missing");
    }
  };

  // update food item under selected category
  const handleSaveFoodItem = async (foodDetails) => {
    // Check if required fields are filled
    console.log(foodDetails);
    if (
      selectedCategory &&
      foodDetails.dishName?.trim() !== "" &&
      foodDetails.price?.trim() !== ""
    ) {
      try {
        // Reference to the document in Firestore
        const foodItemRef = doc(db, "foodList", foodDetails.id);

        // Update the document with new data
        await updateDoc(foodItemRef, {
          categoryId: selectedCategory.id,
          category: selectedCategory.name,
          dishName: foodDetails.dishName,
          categorized: foodDetails.categorized || "",
          price: foodDetails.price,
          img: foodDetails.img || "",
        });

        // Optionally update state or reset form fields after successful update
        console.log("Food item updated successfully!");
      } catch (error) {
        console.error("Error updating food item: ", error);
        // Handle error state or show error message
      }
    } else {
      console.error("Missing required fields.");
      // Handle missing fields error state or show error message
    }
  };

  const handleFoodCardClick = (food) => {
    setSelectedCard(food.dishName);
    setFoodDetails(food);
    setAddNewFoodList(false);
  };

  // delete food item
  const handleDeleteFood = async (food) => {
    if (selectedCard) {
      try {
        await deleteDoc(doc(db, "foodList", food.id));
        setSelectedCard(null);
        setFoodDetails({
          category: "",
          dishName: "",
          price: "",
          categorized: "",
          img: "",
        });
      } catch (e) {
        console.error("Error deleting food item: ", e);
      }
    }
  };

  const handleSoldOutToggle = async (food) => {
    console.log(food);
    try {
      const foodDoc = doc(db, "foodList", food.id);
      await updateDoc(foodDoc, {
        isSoldOut: !food.isSoldOut,
      });
    } catch (e) {
      console.error("Error toggling sold out status: ", e);
    }
  };

  // -------------------------------- RENDER UI --------------------------------

  const renderAddFoodFields = () => {
    return (
      <Paper sx={categoriesStyle} elevation={6}>
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
              {!addNewFoodList
                ? `Edit ${foodDetails.dishName}  `
                : ` Add food item under ${selectedCategory.name}`}
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
              label="Categorized"
              name="categorized"
              value={foodDetails.categorized}
              onChange={handleFoodInputChange}
              fullWidth
              sx={{ mb: 2, ...textInputStyle }}
            >
              <MenuItem value="veg">Veg</MenuItem>
              <MenuItem value="non-veg">Non-Veg</MenuItem>
            </TextField>
            {/* <Box sx={{ my: 2, width: 200, height: 200 }}>
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
                foodDetails.img && (
                  <img
                    src={foodDetails.img}
                    width={"100%"}
                    height={"100%"}
                    style={{ borderRadius: 10 }}
                    alt="img"
                  />
                )
              )}
            </Box> */}
            <Box sx={{ my: 2, width: "100px", height: "100px" }}>
              {foodImgUploading ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "50%",
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
                foodDetails.img && (
                  <img
                    src={foodDetails.img}
                    width={"100%"}
                    height={"100%"}
                    style={{
                      borderRadius: "50%",
                      background: "#fff",
                      objectFit: "contain",
                      boxShadow: "0px 15px 20px 0px #00000031",
                    }}
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
              Upload Image
              <CloudUploadIcon />
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={handleFoodFileChange}
              />
            </Button>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              {!addNewFoodList ? (
                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      height: 40,
                      marginBottom: "10px",
                      width: "40%",
                      // width: "100%",
                      color: "red",
                      background: "#fff",
                      alignItems: "center",
                      justifyContent: "space-around",
                      fontWeight: "bold",
                      fontSize: { xs: 12, md: 12 },
                      borderColor: "red",
                      textTransform: "capitalize",
                      "&:hover": {
                        borderColor: "red",
                        background: "#fff",
                      },
                    }}
                    onClick={() => handleDeleteFood(foodDetails)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleSaveFoodItem(foodDetails)}
                    sx={{
                      height: 40,
                      marginBottom: "10px",
                      width: "40%",
                      color: "#fff",
                      background: "#125238",
                      alignItems: "center",
                      justifyContent: "space-around",
                      fontWeight: "bold",
                      fontSize: { xs: 12, md: 12 },
                      borderColor: "#125238",
                      textTransform: "capitalize",
                      "&:hover": {
                        borderColor: "#125238",
                        background: "#125238",
                      },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => handleAddFoodItem()}
                  sx={{
                    height: 40,
                    marginBottom: "10px",
                    width: "40%",
                    color: "#fff",
                    background: "#125238",
                    alignItems: "center",
                    justifyContent: "space-around",
                    fontWeight: "bold",
                    fontSize: { xs: 12, md: 12 },
                    borderColor: "#125238",
                    textTransform: "capitalize",
                    "&:hover": {
                      borderColor: "#125238",
                      background: "#125238",
                    },
                  }}
                >
                  Add Food
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    );
  };

  const editCategoryFields = () => {
    return (
      <Paper sx={categoriesStyle} elevation={6}>
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

          <Box sx={{ my: 2, width: "100px", height: "100px" }}>
            {uploading ? (
              <Box
                sx={{
                  width: "100%",
                  height: "50%",
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
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0px 15px 20px 0px #00000021",
                  }}
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
            Upload Image
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
              variant="outlined"
              onClick={handleDelete}
              sx={{
                height: 40,
                marginBottom: "10px",
                width: "40%",
                // width: "100%",
                color: "red",
                background: "#fff",
                alignItems: "center",
                justifyContent: "space-around",
                fontWeight: "bold",
                fontSize: { xs: 12, md: 12 },
                borderColor: "red",
                textTransform: "capitalize",
                "&:hover": {
                  borderColor: "red",
                  background: "#fff",
                },
              }}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              onClick={handleSaveChanges}
              sx={{
                height: 40,
                marginBottom: "10px",
                width: "40%",
                color: "#fff",
                background: "#125238",
                alignItems: "center",
                justifyContent: "space-around",
                fontWeight: "bold",
                fontSize: { xs: 12, md: 12 },
                borderColor: "#125238",
                textTransform: "capitalize",
                "&:hover": {
                  borderColor: "#125238",
                  background: "#125238",
                },
              }}
            >
              Save
            </Button>
          </Box>
        )}
      </Paper>
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
              setAddNewFoodList(true);
              setShowEditFields(true);
              // Reset form
              setFoodDetails({
                category: "",
                dishName: "",
                price: "",
                img: "",
              });
            }}
          >
            <AddIcon style={{ color: "#000" }} />
          </Button>
        </Box>
        <TabBar
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <Divider sx={{ backgroundColor: "#00000090", width: "100%", mb: 2 }} />
        {filteredFoodListByTab.length ? (
          <Box sx={{ ...scrollVerbarStyles }}>
            {filteredFoodListByTab.map((food, index) => (
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
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={food.isSoldOut}
                      onChange={() => handleSoldOutToggle(food)}
                      icon={
                        <span
                          style={{
                            display: "inline-block",
                            width: 15,
                            height: 15,
                            border: "2px solid black",
                            margin: "3.5px",
                          }}
                        />
                      }
                      checkedIcon={
                        <CancelIcon
                          style={{ color: "red", width: 22, height: 22, m: 0 }}
                        />
                      }
                      sx={{
                        "& .MuiSvgIcon-root": {
                          color: food.isSoldOut ? "red" : "black",
                        },
                      }}
                    />
                    <Box
                      sx={{
                        flexDirection: "column",
                        paddingLeft: "15px",
                      }}
                    >
                      <Typography sx={{ fontSize: 14 }}>
                        Dish Name: {food.dishName}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        Price: ₹{food.price}
                      </Typography>
                    </Box>
                  </Box>
                  <img
                    src={food.categorized == "veg" ? vegIcon : nonVegIcon}
                    width={"40px"}
                    height={"35px"}
                    style={{
                      borderRadius: 10,
                      objectFit: "fill",
                      justifySelf: "right",
                    }}
                    alt="img"
                  />
                </Paper>
              </Grid>
            ))}
          </Box>
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
        background: "#eee",
        borderRadius: 2,
        p: 2,
      }}
    >
      {/* --------------------- CATEGORIES BOX --------------------- */}
      <Typography
        gutterBottom
        sx={{ color: "#000", fontSize: 20, mt: 1, fontWeight: 600 }}
      >
        Category
      </Typography>
      <Box sx={{ ...scrollbarStyles }}>
        <Grid container spacing={2} sx={{ flexWrap: "nowrap", p: 2, pt: 0 }}>
          {categories.map((item) => (
            <Grid item key={item.id} sx={{ pt: 0 }}>
              <Paper
                elevation={6}
                sx={{
                  ...gridItemStyles,
                }}
                onClick={() => handleCardClick(item)}
              >
                <Box
                  sx={{
                    width: { xs: "50px", md: "70px" },
                    height: { xs: "50px", md: "70px" },
                    mb: 0.5,
                  }}
                >
                  {item.id === "new-id" ? (
                    <img
                      src={plusIcon}
                      width={"100%"}
                      height={"100%"}
                      style={{
                        borderRadius: "50%",
                        objectFit: "contain",
                        backgroundColor: "#ffff",
                        // boxShadow: "0px 0px 20px 0px #00000090",
                        boxShadow: "0px 15px 20px 0px #00000031",
                      }}
                      alt="img"
                    />
                  ) : (
                    <img
                      src={item.imgSrc}
                      width={"100%"}
                      height={"100%"}
                      style={{
                        borderRadius: "50%",
                        objectFit: "contain",
                        backgroundColor: "#ffff",
                        // boxShadow: "0px 0px 20px 0px #00000090",
                        boxShadow: "0px 15px 20px 0px #00000031",
                      }}
                      alt="img"
                    />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: 12, md: 16 },
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    px: 2,
                    // mb: 1,
                  }}
                  noWrap={true}
                >
                  {item.name}
                </Typography>
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
          <Box sx={{ width: { xs: "100%", md: "25%" }, my: 1 }}>
            {editCategoryFields()}
          </Box>
        )}
        {editedCategory?.id !== "new-id" && (
          <Box sx={{ width: { xs: "100%", md: "34%" }, my: 1 }}>
            {foodListBox()}
          </Box>
        )}
        {isShowEditFields && (
          <Box sx={{ width: { xs: "100%", md: "36%" }, my: 1 }}>
            {renderAddFoodFields()}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Categories;
