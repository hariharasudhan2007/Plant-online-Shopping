import React, { useState } from "react";
import { 
  X, 
  Star, 
  Sun, 
  Droplet, 
  Wind, 
  ShieldCheck, 
  ShieldAlert, 
  ShoppingBag, 
  FolderPlus, 
  Check, 
  Sparkles,
  Info,
  Package,
  Layers
} from "lucide-react";
import { PlantProduct, Project } from "../types";

interface PlantDetailModalProps {
  plant: PlantProduct | null;
  onClose: () => void;
  onAddToCart: (plant: PlantProduct, quantity?: number) => void;
  projects?: Project[];
  onAssignToProject?: (plant: PlantProduct, projectId: string) => void;
  onAskAiAboutPlant?: (plantName: string) => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  onClose,
  onAddToCart,
  projects = [],
  onAssignToProject,
  onAskAiAboutPlant,
}) => {
  if (!plant) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [addedCartSuccess, setAddedCartSuccess] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(plant, quantity);
    setAddedCartSuccess(true);
    setTimeout(() => setAddedCartSuccess(false), 2000);
  };

  const handleAssignProject = () => {
    if (!selectedProjectId || !onAssignToProject) return;
    onAssignToProject(plant, selectedProjectId);
    setAssignedSuccess(true);
    setTimeout(() => setAssignedSuccess(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#e2ece5] text-[#1a2e22]"
        id={`plant-detail-modal-${plant.id}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-sm border border-gray-200 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Quick Badges */}
          <div className="relative h-72 md:h-full min-h-[340px] bg-[#eef4f0]">
            <img
              src={plant.image}
              alt={plant.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-white/95 text-[#1b4332] shadow-xs backdrop-blur-xs">
                {plant.careDifficulty}
              </span>
              {plant.petFriendly ? (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" /> Pet Friendly
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 shadow-xs">
                  <ShieldAlert className="w-3.5 h-3.5" /> Toxic to Pets
                </span>
              )}
            </div>
          </div>

          {/* Plant Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-[#52796f] mb-1 font-medium">
                <span>{plant.category.toUpperCase().replace("-", " ")}</span>
                <span>•</span>
                <span>{plant.potSize}</span>
              </div>

              <h2 className="text-2xl font-bold text-[#1b4332] font-display mb-1">
                {plant.name}
              </h2>
              <p className="italic text-[#52796f] text-sm font-serif mb-3">
                {plant.botanicalName}
              </p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between py-2 border-b border-[#e2ece5] mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#1b4332]">
                    ${plant.price.toFixed(2)}
                  </span>
                  {plant.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${plant.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{plant.rating}</span>
                  <span className="text-gray-400 font-normal text-xs">({plant.reviewCount})</span>
                </div>
              </div>

              <p className="text-[#3c5545] text-sm leading-relaxed mb-5">
                {plant.description}
              </p>

              {/* Care Specs Grid */}
              {plant.category === "pots" ? (
                <div className="grid grid-cols-3 gap-2 bg-[#f4f7f5] p-3 rounded-xl border border-[#e2ece5] mb-5">
                  <div className="flex flex-col items-center text-center">
                    <Package className="w-4 h-4 text-emerald-700 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Dimensions</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.potSize}</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-x border-[#dbe6df]">
                    <Layers className="w-4 h-4 text-teal-600 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Material</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.humidity}</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Profile</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.tags[0] || "Artisan"}</span>
                  </div>
                </div>
              ) : plant.category === "care-supplies" ? (
                <div className="grid grid-cols-3 gap-2 bg-[#f4f7f5] p-3 rounded-xl border border-[#e2ece5] mb-5">
                  <div className="flex flex-col items-center text-center">
                    <Package className="w-4 h-4 text-emerald-700 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Net Package</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.potSize}</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-x border-[#dbe6df]">
                    <Layers className="w-4 h-4 text-teal-600 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Formula / Form</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.humidity}</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Standard</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.tags[0] || "Organic"}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 bg-[#f4f7f5] p-3 rounded-xl border border-[#e2ece5] mb-5">
                  <div className="flex flex-col items-center text-center">
                    <Sun className="w-4 h-4 text-amber-600 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Light</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.light}</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-x border-[#dbe6df]">
                    <Droplet className="w-4 h-4 text-blue-600 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Water</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.water}</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Wind className="w-4 h-4 text-emerald-600 mb-1" />
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Humidity</span>
                    <span className="text-xs font-semibold text-[#1b4332] line-clamp-1">{plant.humidity}</span>
                  </div>
                </div>
              )}

              {/* Horticultural Care Tips */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#52796f] mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> {plant.category === "pots" ? "Potting & Maintenance Notes" : plant.category === "care-supplies" ? "Application & Blending Guide" : "Horticultural Care Notes"}
                </h4>
                <ul className="space-y-1.5 text-xs text-[#3c5545]">
                  {plant.careTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#2d6a4f] font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions: Add to Cart & Assign to Project */}
            <div className="space-y-3 pt-3 border-t border-[#e2ece5]">
              {/* Add to Cart row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#cbd7cf] rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-[#f1f6f3] font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-semibold text-[#1b4332]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-[#f1f6f3] font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  id="plant-modal-add-to-cart"
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    addedCartSuccess
                      ? "bg-emerald-700 text-white"
                      : "bg-[#2d6a4f] hover:bg-[#1b4332] text-white shadow-sm"
                  }`}
                >
                  {addedCartSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart (${(plant.price * quantity).toFixed(2)})
                    </>
                  )}
                </button>
              </div>

              {/* Link plant directly to a project */}
              <div className="flex items-center gap-2 bg-[#f4f7f5] p-2.5 rounded-xl border border-[#e2ece5]">
                <FolderPlus className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="flex-1 bg-white border border-[#cbd7cf] rounded-lg px-2.5 py-1 text-xs text-[#1b4332] focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      Project: {proj.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignProject}
                  id="plant-modal-assign-project"
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    assignedSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-white hover:bg-[#2d6a4f] hover:text-white text-[#2d6a4f] border border-[#2d6a4f]"
                  }`}
                >
                  {assignedSuccess ? "Assigned!" : "Assign Plant"}
                </button>
              </div>

              {/* Ask AI Flora */}
              <button
                onClick={() => {
                  onClose();
                  onAskAiAboutPlant?.(plant.name);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-[#2d6a4f] hover:text-[#1b4332] hover:bg-[#eaf2ed] rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
                Ask Flora AI about lighting & care for this plant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
