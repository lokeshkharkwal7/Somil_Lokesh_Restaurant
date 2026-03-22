const menuData = {
      rest_id: "69a973fb7fda258dd239a00e",
    restaurant_name: "Siddharth Spicy Junction",
    isActive: true,
    categories: [
      {
        name: "Main Course",
        description: "Delicious curries",
        isActive: true,
        items: [
          {
            name: "Paneer Butter Masala",
            description: "Creamy tomato gravy",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 250,
            tax: 5,
            preparation_time: 15,
            isAvailable: true,
            operationGroups: [
              {
                name: "Spice Level",
                minSelect: 1,
                maxSelect: 1,
                isRequired: true,
                modifiers: [
                  {
                    name: "Medium",
                    price: 0,
                    isDefault: true,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a016"
                  },
                  {
                    name: "Extra Spicy",
                    price: 10,
                    isDefault: false,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a017"
                  }
                ],
                _id: "69a974347fda258dd239a015"
              }
            ],
            _id: "69a974347fda258dd239a014"
          },
          {
            name: "Chana Masala",
            description: "Spiced chickpea curry",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 200,
            tax: 5,
            preparation_time: 12,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a025"
          },
          {
            name: "Butter Chicken",
            description: "Tender chicken in creamy sauce",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: false,
            price: 320,
            tax: 5,
            preparation_time: 18,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a026"
          }
        ],
        _id: "69a974347fda258dd239a013"
      },
      {
        name: "Starters",
        description: "Crispy and savory appetizers",
        isActive: true,
        items: [
          {
            name: "Veg Spring Rolls",
            description: "Crispy rolls with veggie filling",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 180,
            tax: 5,
            preparation_time: 10,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a019"
          },
          {
            name: "Samosa",
            description: "Crispy pastry with spiced filling",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 120,
            tax: 5,
            preparation_time: 8,
            isAvailable: true,
            operationGroups: [
              {
                name: "Dips",
                minSelect: 0,
                maxSelect: 2,
                isRequired: false,
                modifiers: [
                  {
                    name: "Green Chutney",
                    price: 0,
                    isDefault: false,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a02a"
                  },
                  {
                    name: "Tamarind Chutney",
                    price: 0,
                    isDefault: false,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a02b"
                  }
                ],
                _id: "69a974347fda258dd239a029"
              }
            ],
            _id: "69a974347fda258dd239a027"
          },
          {
            name: "Paneer Tikka",
            description: "Grilled paneer with spices",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 220,
            tax: 5,
            preparation_time: 12,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a02c"
          }
        ],
        _id: "69a974347fda258dd239a018"
      },
      {
        name: "Beverages",
        description: "Refreshing drinks",
        isActive: true,
        items: [
          {
            name: "Mango Lassi",
            description: "Traditional yogurt based drink",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 90,
            tax: 5,
            preparation_time: 5,
            isAvailable: true,
            operationGroups: [
              {
                name: "Add-ons",
                minSelect: 0,
                maxSelect: 2,
                isRequired: false,
                modifiers: [
                  {
                    name: "Extra Sugar",
                    price: 0,
                    isDefault: false,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a01d"
                  },
                  {
                    name: "Dry Fruits",
                    price: 20,
                    isDefault: false,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a01e"
                  }
                ],
                _id: "69a974347fda258dd239a01c"
              }
            ],
            _id: "69a974347fda258dd239a01b"
          },
          {
            name: "Iced Tea",
            description: "Refreshing chilled tea",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 70,
            tax: 5,
            preparation_time: 3,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a02d"
          },
          {
            name: "Fresh Lime Water",
            description: "Citrus refreshment",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 50,
            tax: 5,
            preparation_time: 2,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a02e"
          }
        ],
        _id: "69a974347fda258dd239a01a"
      },
      {
        name: "Desserts",
        description: "Sweet treats to end your meal",
        isActive: true,
        items: [
          {
            name: "Gulab Jamun",
            description: "Deep fried milk solids in sugar syrup",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 120,
            tax: 5,
            preparation_time: 5,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a020"
          },
          {
            name: "Kheer",
            description: "Rice pudding with cardamom",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 100,
            tax: 5,
            preparation_time: 4,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a02f"
          }
        ],
        _id: "69a974347fda258dd239a01f"
      },
      {
        name: "Breads",
        description: "Freshly baked Indian breads",
        isActive: true,
        items: [
          {
            name: "Naan",
            description: "Soft and fluffy traditional bread",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 60,
            tax: 5,
            preparation_time: 6,
            isAvailable: true,
            operationGroups: [
              {
                name: "Type",
                minSelect: 1,
                maxSelect: 1,
                isRequired: true,
                modifiers: [
                  {
                    name: "Plain",
                    price: 0,
                    isDefault: true,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a031"
                  },
                  {
                    name: "Garlic",
                    price: 10,
                    isDefault: false,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a032"
                  },
                  {
                    name: "Butter",
                    price: 15,
                    isDefault: false,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a033"
                  }
                ],
                _id: "69a974347fda258dd239a030"
              }
            ],
            _id: "69a974347fda258dd239a034"
          },
          {
            name: "Roti",
            description: "Whole wheat Indian flatbread",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 40,
            tax: 5,
            preparation_time: 4,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a035"
          },
          {
            name: "Paratha",
            description: "Layered fried flatbread",
            image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 80,
            tax: 5,
            preparation_time: 8,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a036"
          }
        ],
        _id: "69a974347fda258dd239a037"
      },
      {
        name: "Rice Dishes",
        description: "Aromatic rice preparations",
        isActive: true,
        items: [
          {
            name: "Biryani",
            description: "Fragrant basmati rice with meat",
                       image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: false,
            price: 350,
            tax: 5,
            preparation_time: 20,
            isAvailable: true,
            operationGroups: [
              {
                name: "Protein",
                minSelect: 1,
                maxSelect: 1,
                isRequired: true,
                modifiers: [
                  {
                    name: "Chicken",
                    price: 0,
                    isDefault: true,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a039"
                  },
                  {
                    name: "Mutton",
                    price: 50,
                    isDefault: false,
                    isAvailable: true,
                    _id: "69a974347fda258dd239a03a"
                  }
                ],
                _id: "69a974347fda258dd239a038"
              }
            ],
            _id: "69a974347fda258dd239a03b"
          },
          {
            name: "Fried Rice",
            description: "Stir-fried rice with vegetables",
                        image: "https://media.istockphoto.com/id/1091828854/photo/cooking-a-traditional-gormet-tomato-sauce-and-wooden-spoon-on-a-stainless-steal-hob.jpg?s=2048x2048&w=is&k=20&c=0o1bKZ08oM_2V0jgTHQkO8d-6ZbgQopntFrnHtxXQ6c=",
            isVeg: true,
            price: 180,
            tax: 5,
            preparation_time: 10,
            isAvailable: true,
            operationGroups: [],
            _id: "69a974347fda258dd239a03c"
          }
        ],
        _id: "69a974347fda258dd239a03d"
      }
    ],
    _id: "69a974347fda258dd239a012",
    createdAt: "2026-03-05T12:16:52.873Z",
    updatedAt: "2026-03-05T12:16:52.873Z",
    __v: 0
}

export default menuData;
