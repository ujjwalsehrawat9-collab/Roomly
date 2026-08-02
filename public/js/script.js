(() => {
  "use strict";

  // Bootstrap-style client-side form validation
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Tax toggle on the index page (show/hide "+ GST" note on cards)
document.addEventListener("DOMContentLoaded", function () {
  const taxSwitch = document.getElementById("flexSwitchCheckDefault");
  if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
      const taxInfo = document.getElementsByClassName("tax-info");
      for (const info of taxInfo) {
        info.style.display = info.style.display !== "inline" ? "inline" : "none";
      }
    });
  }
});

// Category filter bar: left/right scroll buttons + touch swipe
document.addEventListener("DOMContentLoaded", function () {
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");
  const filtersContainer = document.getElementById("filters-container");
  const firstFilter = document.querySelector(".filter");

  if (leftBtn && rightBtn && filtersContainer && firstFilter) {
    const filterWidth = firstFilter.offsetWidth + 32;

    leftBtn.addEventListener("click", function () {
      filtersContainer.scrollLeft -= filterWidth;
    });

    rightBtn.addEventListener("click", function () {
      filtersContainer.scrollLeft += filterWidth;
    });

    let startX;
    let scrollLeft;

    filtersContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].pageX;
      scrollLeft = filtersContainer.scrollLeft;
    });

    filtersContainer.addEventListener("touchmove", (e) => {
      const x = e.touches[0].pageX;
      const walk = startX - x;
      filtersContainer.scrollLeft = scrollLeft + walk;
    });
  }
});

// Toggle a review card between read-only view and inline edit form
function toggleEditReview(reviewId) {
  const displayEl = document.getElementById(`reviewDisplay-${reviewId}`);
  const editEl = document.getElementById(`reviewEdit-${reviewId}`);
  if (!displayEl || !editEl) return;

  const isEditing = !editEl.classList.contains("d-none");
  displayEl.classList.toggle("d-none", !isEditing);
  editEl.classList.toggle("d-none", isEditing);
}

// Category checkboxes on new/edit listing forms: HTML doesn't support
// "at least one checked" validation natively, so we mirror the checked
// state onto a hidden `required` checkbox that the browser does validate.
document.addEventListener("DOMContentLoaded", function () {
  const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
  const categoryRequired = document.getElementById("categoryRequired");

  if (categoryCheckboxes.length && categoryRequired) {
    const syncCategoryRequired = () => {
      const anyChecked = Array.from(categoryCheckboxes).some((cb) => cb.checked);
      categoryRequired.checked = anyChecked;
    };
    categoryCheckboxes.forEach((cb) =>
      cb.addEventListener("change", syncCategoryRequired)
    );
    syncCategoryRequired(); // run once on load — matters on the edit form, which may load with boxes pre-checked
  }
});

// Delete confirmation (listings & reviews)
function confirmDelete() {
  return confirm("Are you sure you want to delete this listing?");
}

// Reserve button: no backend booking, just show a success modal
document.addEventListener("DOMContentLoaded", function () {
  const reserveBtn = document.getElementById("reserveBtn");
  const reserveModalEl = document.getElementById("reserveModal");

  if (reserveBtn && reserveModalEl && window.bootstrap) {
    reserveBtn.addEventListener("click", function () {
      const reserveModal = new bootstrap.Modal(reserveModalEl);
      reserveModal.show();
    });
  }
});