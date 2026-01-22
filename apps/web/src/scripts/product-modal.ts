/**
 * Shared logic for Product Detail Modal
 */

export function initProductModal() {
  const modal = document.getElementById("productModal");
  if (!modal) return;

  const modalImage = document.getElementById(
    "productModalImage",
  ) as HTMLImageElement;
  const modalTitle = document.getElementById("productModalTitle");
  const modalDesc = document.getElementById("productModalDescription");
  const modalDims = document.getElementById("productModalDimensions");
  const modalCap = document.getElementById("productModalCapacity");
  const modalDetailsGroup = document.getElementById("productModalDetailsGroup");
  const modalPrice = document.getElementById("productModalPrice");

  // Footer Elements
  const modalStepper = document.getElementById("modalStepper");
  const modalQtyDisplay = document.getElementById("modalQtyDisplay");
  const modalBtnMinus = document.getElementById("modalBtnMinus");
  const modalBtnPlus = document.getElementById("modalBtnPlus");
  const modalCtaLink = document.getElementById(
    "modalCtaLink",
  ) as HTMLAnchorElement;

  const modalClose = document.getElementById("productModalClose");
  const modalOverlay = document.querySelector(".product-modal-overlay");

  let activeProductId: string | null = null;
  const isProdukPage = window.location.pathname.includes("/produk");

  function updateModalQty() {
    if (!activeProductId || !modalQtyDisplay) return;
    const calcQtyEl = document.querySelector(
      `.cart-item-qty[data-id="${activeProductId}"]`,
    );
    if (calcQtyEl) {
      modalQtyDisplay.textContent = calcQtyEl.textContent;
    }
  }

  function openModal(trigger: HTMLElement) {
    activeProductId = trigger.dataset.id || null;

    if (modalImage && modalTitle && modalDesc && modalPrice) {
      modalImage.src =
        (trigger as HTMLImageElement).src || trigger.dataset.image || "";
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
        price,
      )}/hari`;

      // Context-aware Footer
      if (isProdukPage) {
        if (modalStepper) modalStepper.style.display = "none";
        if (modalCtaLink) {
          modalCtaLink.style.display = "block";
          modalCtaLink.href = `/?id=${activeProductId}#calculator`;
        }
      } else {
        if (modalCtaLink) modalCtaLink.style.display = "none";
        if (modalStepper) {
          modalStepper.style.display = "flex";
          updateModalQty();
        }
      }

      if (modal) {
        modal.classList.add("active");
      }
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("active");
    }
    document.body.style.overflow = "";
    activeProductId = null;
  }

  // Stepper Proxy Logic
  modalBtnPlus?.addEventListener("click", () => {
    if (!activeProductId) return;
    const calcPlus = document.querySelector(
      `.btn-plus[data-id="${activeProductId}"]`,
    ) as HTMLButtonElement;
    if (calcPlus) {
      calcPlus.click();
      updateModalQty();
    }
  });

  modalBtnMinus?.addEventListener("click", () => {
    if (!activeProductId) return;
    const calcMinus = document.querySelector(
      `.btn-minus[data-id="${activeProductId}"]`,
    ) as HTMLButtonElement;
    if (calcMinus) {
      calcMinus.click();
      updateModalQty();
    }
  });

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
