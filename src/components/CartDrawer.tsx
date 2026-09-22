import React, { useState } from "react";
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Sparkles,
  PackageCheck
} from "lucide-react";
import { CartItem, Task } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  cart?: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart?: () => void;
  onOrderCompleted?: (task: Task) => void;
  onCheckoutSuccess?: (generatedTasks: Task[]) => void;
  onNavigateToShop?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems: propCartItems,
  cart: propCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCompleted,
  onCheckoutSuccess,
  onNavigateToShop,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form states for checkout
  const [shippingName, setShippingName] = useState("Botanical Enthusiast");
  const [shippingAddress, setShippingAddress] = useState("742 Evergreen Terrace, Greenhouse Apt 4");
  const [shippingCity, setShippingCity] = useState("Portland, OR 97201");

  const cartItems = propCartItems || propCart || [];

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + ((item?.product?.price || 0) * (item?.quantity || 1)),
    0
  );
  const discountAmount = rawSubtotal * (discountPercent / 100);
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const shippingFee = rawSubtotal > 50 || rawSubtotal === 0 ? 0 : 7.99;
  const estimatedTax = subtotalAfterDiscount * 0.08;
  const grandTotal = subtotalAfterDiscount + shippingFee + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === "VERDANT15" || cleaned === "SPRING15") {
      setDiscountPercent(15);
      setPromoSuccess("15% Botanical Discount Applied!");
    } else if (cleaned === "GREEN20") {
      setDiscountPercent(20);
      setPromoSuccess("20% VIP Greenery Discount Applied!");
    } else {
      setPromoError("Invalid code. Try 'VERDANT15' for 15% off.");
    }
  };

  const handleCompleteOrder = () => {
    // Generate an automatic task for nursery unboxing & care
    const plantNames = cartItems.map(item => item?.product?.name || "Plant").join(", ");
    const newDeliveryTask: Task = {
      id: `task-order-${Date.now()}`,
      title: `Unbox & inspect delivery: ${plantNames}`,
      description: `Delivery arriving for ${shippingName} at ${shippingAddress}. Gently unpack nursery shipping box, check soil moisture, and place in medium indirect light for 48h acclamation.`,
      category: "Store Order",
      priority: "urgent",
      status: "todo",
      dueDate: "In 2 days",
      projectName: "Living Room Jungle Sanctuary",
      plantName: cartItems[0]?.product?.name || "New Plants",
      createdAt: new Date().toISOString(),
    };

    if (onOrderCompleted) {
      onOrderCompleted(newDeliveryTask);
    }
    if (onCheckoutSuccess) {
      onCheckoutSuccess([newDeliveryTask]);
    }
    setOrderPlaced(true);
  };

  const handleFinishAndReset = () => {
    onClearCart?.();
    setOrderPlaced(false);
    setIsCheckingOut(false);
    onNavigateToShop?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#e2ece5]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#e2ece5] flex items-center justify-between bg-[#f8faf8]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#2d6a4f]" />
              <h2 className="font-display font-bold text-lg text-[#1b4332]">
                Your Botanical Cart
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#d8f3dc] text-[#1b4332]">
                {(cartItems || []).reduce((s, i) => s + (i?.quantity || 1), 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-[#eaf2ed] hover:text-[#1b4332] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content or Checkout View */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderPlaced ? (
              /* Order Success Screen */
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-display font-bold text-2xl text-[#1b4332]">
                  Order Confirmed!
                </h3>
                <p className="text-sm text-[#405648] max-w-xs mx-auto">
                  Thank you, <span className="font-semibold">{shippingName}</span>. Your plants are being hand-packed with nursery heat-packs.
                </p>
                
                {/* Integration notice with Tasks */}
                <div className="bg-[#eef5f0] p-4 rounded-xl text-left border border-[#cbe0d3] space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                    <PackageCheck className="w-4 h-4 text-[#2d6a4f]" />
                    Task Automatically Scheduled
                  </div>
                  <p className="text-xs text-[#2d6a4f]">
                    We created an <strong>Unbox & Inspect Delivery</strong> task in your Task Management board to ensure smooth plant acclamation!
                  </p>
                </div>

                <button
                  onClick={handleFinishAndReset}
                  className="w-full py-3 bg-[#2d6a4f] text-white rounded-xl font-semibold hover:bg-[#1b4332] transition-all cursor-pointer shadow-sm mt-4"
                >
                  View Tasks & Return to Studio
                </button>
              </div>
            ) : isCheckingOut ? (
              /* Checkout Form */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2ece5]">
                  <h3 className="font-semibold text-sm text-[#1b4332]">Delivery Information</h3>
                  <button
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-[#2d6a4f] hover:underline cursor-pointer"
                  >
                    Back to cart
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#cbd7cf] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#cbd7cf] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City, State, Zip</label>
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#cbd7cf] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                    />
                  </div>
                </div>

                <div className="bg-[#f8faf8] p-3.5 rounded-xl border border-[#e2ece5] text-xs space-y-2 mt-4">
                  <div className="flex items-center gap-2 font-semibold text-[#1b4332]">
                    <Truck className="w-4 h-4 text-[#2d6a4f]" /> Safe Botanical Transit Guarantee
                  </div>
                  <p className="text-gray-600">
                    Insulated temperature-regulated box packaging. Live plant arrival guaranteed or free replacement.
                  </p>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#f1f6f3] text-[#52796f] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-[#1b4332]">Your cart is empty</h3>
                <p className="text-xs text-[#52796f] max-w-xs mx-auto">
                  Discover lush house plants, rare variegated aroids, and sustainable care supplies in our shop.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-[#2d6a4f] rounded-lg hover:bg-[#1b4332] transition-colors cursor-pointer"
                >
                  Explore Plant Catalog
                </button>
              </div>
            ) : (
              /* Cart Items List */
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-xl bg-[#f8faf8] border border-[#e2ece5] transition-all"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-xs sm:text-sm text-[#1b4332] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="italic text-[11px] text-[#52796f] truncate mb-2">
                        {item.product.botanicalName}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#cbd7cf] rounded-md bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-semibold text-[#1b4332]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-[#1b4332]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Free Shipping Progress Indicator */}
                <div className="bg-[#f1f6f3] p-3 rounded-xl border border-[#e2ece5]">
                  <div className="flex justify-between text-xs font-medium text-[#1b4332] mb-1.5">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#2d6a4f]" />
                      {rawSubtotal >= 50
                        ? "You unlocked Free Climate-Controlled Delivery!"
                        : `Add $${(50 - rawSubtotal).toFixed(2)} more for Free Delivery`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#cbd7cf] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2d6a4f] rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (rawSubtotal / 50) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-1 pt-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Discount code (e.g. VERDANT15)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs border border-[#cbd7cf] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 text-xs font-semibold bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && (
                    <p className="text-[11px] text-emerald-600 font-medium">{promoSuccess}</p>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {cartItems.length > 0 && !orderPlaced && (
            <div className="p-5 border-t border-[#e2ece5] bg-[#f8faf8] space-y-3">
              <div className="space-y-1.5 text-xs text-[#405648]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1b4332]">${rawSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1b4332] pt-2 border-t border-[#e2ece5]">
                  <span>Total</span>
                  <span className="text-lg text-[#2d6a4f]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {isCheckingOut ? (
                <button
                  onClick={handleCompleteOrder}
                  id="checkout-confirm-btn"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Place Order & Schedule Delivery Task (${grandTotal.toFixed(2)})
                </button>
              ) : (
                <button
                  onClick={() => setIsCheckingOut(true)}
                  id="checkout-proceed-btn"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
