/**
 * Shared logic for Product Detail Modal
 */

export function initProductModal() {
  const modal = document.getElementById("productModal");
  const modalImage = document.getElementById(
    "productModalImage"
  ) as HTMLImageElement;
  const modalTitle = document.getElementById("productModalTitle");
  const modalDesc = document.getElementById("productModalDescription");
  const modalDims = document.getElementById("productModalDimensions");
  const modalCap = document.getElementById("productModalCapacity");
  const modalDetailsGroup = document.getElementById("productModalDetailsGroup");
  const modalPrice = document.getElementById("productModalPrice");

  const modalClose = document.getElementById("productModalClose");
  const modalOverlay = document.querySelector(".product-modal-overlay");

  if (!modal) return;

  function openModal(trigger: HTMLElement) {
    if (modalImage && modalTitle && modalDesc && modalPrice) {
      modalImage.src = (trigger as any).src || trigger.dataset.image || "";
      modalTitle.textContent = trigger.dataset.name || "";
      modalDesc.textContent = trigger.dataset.description || "";

      // Handle dimensions and capacity visibility
      let hasDetails = false;
      if (modalDims) {
        const dims = trigger.dataset.dimensions || "";
        modalDims.textContent = dims;
        modalDims.style.display = dims ? "inline" : "none";
        if (dims) hasDetails = true;
      }
      if (modalCap) {
        const cap = trigger.dataset.capacity || "";
        modalCap.textContent = cap;
        modalCap.style.display = cap ? "inline" : "none";
        if (cap) hasDetails = true;
      }

      if (modalDetailsGroup) {
        modalDetailsGroup.style.display = hasDetails ? "flex" : "none";
      }

      const price = parseInt(trigger.dataset.price || "0");
      modalPrice.textContent = `Rp ${new Intl.NumberFormat("id-ID").format(
        price
      )}/hari`;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Global trigger listener
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const trigger = target.closest("[data-modal-trigger]");
    if (trigger) {
      openModal(trigger as HTMLElement);
    }
  });

  modalClose?.addEventListener("click", closeModal);
  modalOverlay?.addEventListener("click", closeModal);
}
