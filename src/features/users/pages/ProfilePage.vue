<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 class="text-xl font-bold text-slate-800 mb-6">Profil Pengguna</h2>

      <!-- Avatar & Upload Section -->
      <div class="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
        <div class="relative">
          <div
            class="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-indigo-200 flex items-center justify-center text-slate-400 font-bold text-2xl shadow-inner"
          >
            <img
              v-if="avatarPreview || currentUser?.photo"
              :src="avatarPreview || currentUser?.photo || ''"
              alt="Avatar"
              class="w-full h-full object-cover"
              data-testid="avatar-image"
            />
            <span v-else>{{ userInitial }}</span>
          </div>
        </div>

        <div class="flex-1 text-center sm:text-left space-y-2">
          <h3 class="font-semibold text-slate-800">{{ currentUser?.name || 'Memuat...' }}</h3>
          <p class="text-sm text-slate-500">{{ currentUser?.email || '' }}</p>
          <div class="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept="image/png, image/jpeg, image/jpg"
              class="hidden"
              id="avatarUpload"
              data-testid="avatar-input"
            />
            <label
              for="avatarUpload"
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Pilih Foto Baru
            </label>
            <button
              v-if="selectedFile"
              type="button"
              @click="handleUploadAvatar"
              :disabled="isLoading"
              class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
              data-testid="upload-button"
            >
              Simpan Foto
            </button>
            <button
              v-if="selectedFile"
              @click="cancelSelectedFile"
              class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
              data-testid="cancel-photo-button"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <!-- Update Profile Name Form -->
      <form @submit.prevent="handleUpdateName" class="mt-6 space-y-4 max-w-md">
        <div>
          <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
          <input
            id="name"
            type="text"
            required
            :value="name"
            @input="onNameChange"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="name-input"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          data-testid="save-name-button"
        >
          Simpan Nama
        </button>
      </form>
    </div>

    <!-- Change Password Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 class="text-lg font-bold text-slate-800 mb-4">Ganti Kata Sandi</h3>
      <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md">
        <div>
          <label for="current_password" class="block text-sm font-medium text-slate-700 mb-1">Kata Sandi Saat Ini</label>
          <input
            id="current_password"
            type="password"
            required
            :value="currentPassword"
            @input="onCurrentPasswordChange"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="current-password-input"
          />
        </div>
        <div>
          <label for="new_password" class="block text-sm font-medium text-slate-700 mb-1">Kata Sandi Baru</label>
          <input
            id="new_password"
            type="password"
            required
            :value="newPassword"
            @input="onNewPasswordChange"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="new-password-input"
          />
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          data-testid="change-password-button"
        >
          Ubah Kata Sandi
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUsersStore } from "../states/usersStore";
import { useInput } from "../../../hooks/useInput";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const usersStore = useUsersStore();

const [name, onNameChange, setName] = useInput("");
const [currentPassword, onCurrentPasswordChange, , resetCurrentPassword] = useInput("");
const [newPassword, onNewPasswordChange, , resetNewPassword] = useInput("");

const selectedFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);

const currentUser = computed(() => usersStore.currentUser);
const isLoading = computed(() => usersStore.isLoading);

const userInitial = computed(() => {
  return currentUser.value?.name ? currentUser.value.name.charAt(0).toUpperCase() : "U";
});

onMounted(async () => {
  try {
    const user = await usersStore.fetchProfile();
    if (user && user.name) {
      setName(user.name);
    }
  } catch (err) {
    // handled in store
  }
});

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      showErrorDialog("Ukuran file maksimal adalah 2MB");
      return;
    }
    selectedFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const cancelSelectedFile = () => {
  selectedFile.value = null;
  avatarPreview.value = null;
};

const handleUploadAvatar = async () => {
  if (!selectedFile.value) return;
  try {
    await usersStore.uploadAvatar(selectedFile.value);
    await showSuccessDialog("Foto profil berhasil diperbarui!");
    selectedFile.value = null;
    avatarPreview.value = null;
  } catch (err: any) {
    await showErrorDialog(err.message || "Gagal mengunggah foto");
  }
};

const handleUpdateName = async () => {
  try {
    await usersStore.updateProfile({ name: name.value });
    await showSuccessDialog("Nama profil berhasil diperbarui!");
  } catch (err: any) {
    await showErrorDialog(err.message || "Gagal memperbarui profil");
  }
};

const handleChangePassword = async () => {
  try {
    await usersStore.changePassword({
      old_password: currentPassword.value,
      current_password: currentPassword.value,
      password: newPassword.value,
      new_password: newPassword.value,
      password_confirmation: newPassword.value
    });
    await showSuccessDialog("Kata sandi berhasil diubah!");
    resetCurrentPassword();
    resetNewPassword();
  } catch (err: any) {
    await showErrorDialog(err.message || "Gagal mengubah kata sandi");
  }
};
</script>

