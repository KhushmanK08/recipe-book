<script>
  import { createEventDispatcher } from "svelte";
  import { supabase } from "$lib/supabaseClient";

  const dispatch = createEventDispatcher();

  let title = "";
  let ingredients = "";
  let instructions = "";
  let image_url = "";
  let imageFile = null;
  let imagePreview = "";
  let loading = false;
  let error = "";
  let success = "";

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  const maxFileSize = 5 * 1024 * 1024; // 5 MB

  function handleFileChange(event) {
    error = "";
    const file = event.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      error = "Unsupported file type. Please upload PNG, JPEG, GIF, or WEBP.";
      imageFile = null;
      imagePreview = "";
      return;
    }

    if (file.size > maxFileSize) {
      error = "File too large. Maximum allowed size is 5 MB.";
      imageFile = null;
      imagePreview = "";
      return;
    }

    imageFile = file;

    const reader = new FileReader();
    reader.onload = () => (imagePreview = reader.result);
    reader.readAsDataURL(file);
  }

  async function uploadImage(file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `recipes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("recipe-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { publicURL, error: urlError } = supabase.storage
      .from("recipe-images")
      .getPublicUrl(filePath);

    if (urlError) throw urlError;
    return publicURL;
  }

  async function submitRecipe() {
    if (!title.trim()) {
      error = "Title is required.";
      return;
    }

    loading = true;
    error = "";
    success = "";

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      error = "You must be logged in.";
      loading = false;
      return;
    }

    try {
      let finalImageUrl = image_url;
      if (imageFile) finalImageUrl = await uploadImage(imageFile);

      const { error: insertError } = await supabase.from("recipes").insert({
        user_id: user.id,
        title,
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
        instructions: instructions
          .split(".")
          .map((i) => i.trim())
          .filter((i) => i),
        image_url: finalImageUrl,
      });

      if (insertError) throw insertError;

      success = "Recipe added successfully!";
      title = "";
      ingredients = "";
      instructions = "";
      image_url = "";
      imageFile = null;
      imagePreview = "";
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  $: imagePreview = imageFile ? imagePreview : image_url ? image_url : "";
</script>

<div class="modal-backdrop" on:click={() => dispatch("close")}></div>

<div class="modal">
  <h2>Add Your Recipe</h2>

  {#if error}<p class="error">{error}</p>{/if}
  {#if success}<p class="success">{success}</p>{/if}

  <label>Title</label>
  <input type="text" bind:value={title} placeholder="Recipe title" />

  <label>Ingredients (comma separated)</label>
  <input
    type="text"
    bind:value={ingredients}
    placeholder="e.g., eggs, milk, flour"
  />

  <label>Instructions (separate by periods)</label>
  <textarea bind:value={instructions} placeholder="Step 1. Step 2."></textarea>

  <label>Image URL</label>
  <input type="text" bind:value={image_url} placeholder="Optional image link" />

  <label>Or Upload Image</label>
  <input type="file" accept="image/*" on:change={handleFileChange} />

  {#if imagePreview}
    <div class="image-preview">
      <p>Preview:</p>
      <img src={imagePreview} alt="Preview" />
    </div>
  {/if}

  <div class="actions">
    <button class="cancel" on:click={() => dispatch("close")}>Cancel</button>
    <button class="save" on:click={submitRecipe} disabled={loading}>
      {loading ? "Saving..." : "Save Recipe"}
    </button>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--background);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    width: 90%;
    max-width: 500px;
    color: var(--text);
  }
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--accent);
  }
  label {
    display: block;
    margin-top: 0.5rem;
    font-weight: bold;
  }
  input,
  textarea {
    width: 100%;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid var(--accent);
    background: var(--primary);
    color: var(--text);
  }
  textarea {
    resize: vertical;
    min-height: 60px;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .save {
    background: var(--accent);
    color: var(--background);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
  .save:hover {
    background: var(--primary);
    color: var(--text);
  }
  .cancel {
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--text);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
  }
  .cancel:hover {
    background: var(--primary);
  }
  .error {
    color: red;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .success {
    color: green;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .image-preview img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    margin-top: 0.5rem;
    object-fit: cover;
  }
</style>
