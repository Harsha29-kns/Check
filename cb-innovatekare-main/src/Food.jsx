import { useState, useEffect } from 'react';
import axios from 'axios';
import api from './api';

const foodItems = [
  { id: 1, name: "Parota", price: 10, image: "https://th.bing.com/th/id/R.c6819a6d8099487a159e93cf29ca6470?rik=rOAxfwQRhsmUFQ&riu=http%3a%2f%2fcookeryshow.com%2fwp-content%2fuploads%2f2017%2f01%2fhow-to-make-wheat-soft-parotta-k.jpg&ehk=3LUcvDOWmIrHBbOZkcJuz13QJJzaEocdaqXkt3g4Ook%3d&risl=&pid=ImgRaw&r=0", category: "Main Course", isVeg: true },
  { id: 2, name: "Chicken Rice / Noodels", price: 90, image: "https://www.kannammacooks.com/wp-content/uploads/street-style-chicken-rice-recipe-1-3.jpg", category: "Main Course", isVeg: false },
  { id: 3, name: "Egg Rice/ Noodles", price: 80, image: "https://th.bing.com/th/id/OIP.7435pyGh3N-M-3J9oyj-xwAAAA?rs=1&pid=ImgDetMain", category: "Main Course", isVeg: false },
  { id: 4, name: "Veg Rice / Noodles", price: 70, image: "https://recipesofhome.com/wp-content/uploads/2020/06/veg-fried-rice-recipe.jpg", category: "Bread", isVeg: true },
  { id: 5, name: "Chiken Kothu parota", price: 90, image: "https://img.freepik.com/free-photo/indian-sweet-food-gulab-jamun-served-round-ceramic-bowl_466689-74220.jpg", category: "Dessert", isVeg: false },
  { id: 6, name: "Veg Kothu parota", price: 90, image: "https://c.ndtvimg.com/2023-06/vnhgan8_kothu-parotta_625x300_26_June_23.jpg?im=FaceCrop", category: "Beverages", isVeg: false },
  { id: 7, name: "Egg Kothu parota", price: 80, image: "https://th.bing.com/th/id/OIP.l75tXJXjwudVCbRTUrMzPQHaFj?rs=1&pid=ImgDetMain", category: "Snacks", isVeg: true },
  { id: 8, name: "Dosai", price: 20, image: "https://jfwonline.com/wp-content/uploads/2016/11/Plain-dosa-JFW-Article.jpg", category: "Breakfast", isVeg: true },
  { id: 9, name: "Egg Dosai", price: 35, image: "https://th.bing.com/th/id/OIP.aDt6QlpQUoeyPZ2oRMtq0AHaEK?rs=1&pid=ImgDetMain", category: "Beverages", isVeg: false},
  { id: 10, name: "Spl Dosai", price: 40, image: "https://th.bing.com/th/id/OIP.n8xhBfNFDuwju98y9Xm0vwHaEK?rs=1&pid=ImgDetMain", category: "Starters", isVeg: true },
  { id: 11, name: "Chicken roast Dosai", price: 90, image: "https://www.shutterstock.com/shutterstock/photos/2073252083/display_1500/stock-photo-dosa-dosai-ghee-roast-with-chicken-curry-popular-south-indian-breakfast-food-kerala-tamil-nadu-2073252083.jpg", category: "Beverages", isVeg: false },
  { id: 12, name: "Onion roast Dosai", price: 60, image: "https://i.pinimg.com/originals/5d/c4/99/5dc4990a497d4d9cd96cbf592dad3cbb.jpg", category: "Beverages", isVeg: true },
  { id: 13, name: "Omlete", price: 15, image: "https://th.bing.com/th/id/R.9eafdb4139f771d6f30985a99cad2114?rik=fIGJqUfs3i9PrA&riu=http%3a%2f%2fwww.elizabethpeddey.com.au%2fwp-content%2fuploads%2f2020%2f04%2fOMELETTE-scaled.jpg&ehk=uW9E4LaCXiDOMfJZ1x%2focqEG7Yjl46YbspiXgBQog%2fI%3d&risl=&pid=ImgRaw&r=0", category: "Beverages", isVeg: false },
  { id: 14, name: "Poriyal", price: 20, image: "https://www.kamalascorner.com/wp-content/uploads/2007/07/Poriyal1.jpg", category: "Beverages", isVeg: true } 
];

function Food() {
  const [cart, setCart] = useState([]);
  const [team, setTeam] = useState(JSON.parse(localStorage.getItem("team")));
  const [loading, setLoading] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showVegOnly, setShowVegOnly] = useState(false);
  
  const categories = ['All', ...new Set(foodItems.map(item => item.category))];


  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem.quantity === 1) {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    } else {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 } 
          : cartItem
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) return;
    
    setOrderSubmitting(true);
    
    const order = {
      teamname: team?.teamname,
      food: cart,
      price: calculateTotal(),
    };
    axios.post(`${api}/food`,order).then(()=>{
      setOrderSubmitting(false);
          setOrderSuccess(true);
          setCart([]);

    })    .catch(err => {
          setOrderSubmitting(false);
          console.error("Error submitting order:", err);
        });
    }; 
    // For a real implementation:
    // axios.post(`${api}/order`, order)
    //   .then(res => {
    //     setOrderSubmitting(false);
    //     setOrderSuccess(true);
    //     setCart([]);
    //   })
    //   .catch(err => {
    //     setOrderSubmitting(false);
    //     console.error("Error submitting order:", err);
    //   });
  

  // Filter items based on category and veg/non-veg selection
  const filteredItems = foodItems.filter(item => {
    const categoryMatch = filterCategory === 'All' || item.category === filterCategory;
    const vegMatch = showVegOnly ? item.isVeg : true;
    return categoryMatch && vegMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#34D4BA] mx-auto"></div>
          <p className="mt-4 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <h2 className="text-2xl mb-4">Authentication Required</h2>
          <p>Please log in to access the food ordering system</p>
          <button 
            onClick={() => window.location.href = '/teampanel'}
            className="mt-4 px-6 py-2 bg-[#34D4BA] text-black rounded-full hover:bg-[#2ba898]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1a1a]/80 to-[#333]/80 backdrop-blur-md p-4 fixed w-full top-0 z-50 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#34D4BA] text-2xl">🍽️</span>
            <h1 className="text-xl font-bold">Innovative Kare Food Service</h1>
            <h1 className=' bg-purple-400 text-white p-2 rounded-lg'>Powered By Eatzu ⚡</h1>
          </div>
          <div>
            <button 
              onClick={() => window.location.href = '/'}
              className="text-white/80 hover:text-white"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto pt-24 pb-32 px-4">
        <div className="bg-gradient-to-r from-[#34D4BA] to-[#20D4B7] rounded-md p-1 mb-8">
          <div className="bg-gradient-to-r from-[#34D4BA]/10 to-[#20D4B7]/10 backdrop-blur-sm rounded p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Welcome, Team {team.teamname}!
              </h2>
              <p className="text-white/80">Order food for your team</p>
            </div>
            <div className="bg-white/10 py-2 px-4 rounded-lg">
              <p className="text-sm">Sector: <span className="font-bold text-[#34D4BA]">{team.Sector}</span></p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-lg">
          <div className="flex flex-wrap gap-2">
            <h3 className="text-white/80 mr-2">Filter by:</h3>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterCategory === category
                    ? 'bg-[#34D4BA] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showVegOnly}
                onChange={() => setShowVegOnly(!showVegOnly)}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full ${showVegOnly ? 'bg-green-500' : 'bg-gray-600'} p-1 transition-colors duration-200`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${showVegOnly ? 'translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-2">Veg Only</span>
            </label>
          </div>
        </div>

        {/* Menu & Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-[#34D4BA]/50 transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${item.isVeg ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{item.category}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-[#34D4BA]">₹{item.price}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-[#34D4BA]/20 hover:bg-[#34D4BA]/40 text-[#34D4BA] px-3 py-1 rounded-full font-medium transition-colors flex items-center"
                      >
                        <span className="text-lg mr-1">+</span> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 rounded-lg p-4 sticky top-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-2">🛒</span>Your Order
              </h2>
              
              {orderSuccess && (
                <div className="bg-green-800/50 text-green-200 p-3 rounded mb-4 flex items-center">
                  <span className="text-xl mr-2">✓</span>
                  Order successfully placed!
                </div>
              )}

              {cart.length === 0 ? (
                <p className="text-gray-400 py-8 text-center">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto pr-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-800/50 p-3 rounded">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-400 mr-3">₹{item.price} × {item.quantity}</span>
                          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="px-2 py-1 text-red-400 hover:text-red-300"
                            >
                              −
                            </button>
                            <span className="text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="px-2 py-1 text-green-400 hover:text-green-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold">Total Amount:</span>
                      <span className="text-xl font-bold text-[#34D4BA]">₹{calculateTotal()}</span>
                    </div>

                    <button
                      onClick={handleSubmitOrder}
                      disabled={orderSubmitting}
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center
                        ${orderSubmitting 
                          ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                          : 'bg-[#34D4BA] text-black hover:bg-[#2ba898]'}`}
                    >
                      {orderSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-4 border-t border-gray-800">
        <p>© {new Date().getFullYear()} Innovative Kare Hackathon</p>
      </footer>
    </div>
  );
}

export default Food;
