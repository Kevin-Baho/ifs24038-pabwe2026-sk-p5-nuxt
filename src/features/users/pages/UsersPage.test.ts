import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import UsersPage from "./UsersPage.vue";
import { useUsersStore } from "../states/usersStore";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("UsersPage.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("loads and displays users successfully on mount", async () => {
    const usersStore = useUsersStore();
    const mockUsers = [
      { id: "1", name: "Alice", email: "alice@delcom.org", photo: "avatar.jpg" },
      { id: "2", name: "Bob", email: "bob@delcom.org", photo: null }
    ];
    vi.spyOn(usersStore, "fetchUsers").mockImplementation(async () => {
      usersStore.users = mockUsers;
      return mockUsers;
    });

    const wrapper = mount(UsersPage);
    await flushPromises();

    expect(usersStore.fetchUsers).toHaveBeenCalled();
    expect(wrapper.find("[data-testid='users-grid']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).toContain("Bob");
  });

  it("shows empty state when no users are returned", async () => {
    const usersStore = useUsersStore();
    vi.spyOn(usersStore, "fetchUsers").mockImplementation(async () => {
      usersStore.users = [];
      return [];
    });

    const wrapper = mount(UsersPage);
    await flushPromises();

    expect(wrapper.find("[data-testid='empty-state']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Tidak ada data pengguna ditemukan.");
  });

  it("handles fetch failure and shows error dialog", async () => {
    const usersStore = useUsersStore();
    vi.spyOn(usersStore, "fetchUsers").mockRejectedValue(new Error("Gagal mengambil data"));
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(UsersPage);
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Gagal mengambil data");
  });

  it("handles fetch failure fallback message", async () => {
    const usersStore = useUsersStore();
    vi.spyOn(usersStore, "fetchUsers").mockRejectedValue({});
    const showErrorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const wrapper = mount(UsersPage);
    await flushPromises();

    expect(showErrorSpy).toHaveBeenCalledWith("Gagal memuat pengguna");
  });

  it("triggers refresh when clicking Segarkan button", async () => {
    const usersStore = useUsersStore();
    vi.spyOn(usersStore, "fetchUsers").mockResolvedValue([]);

    const wrapper = mount(UsersPage);
    await flushPromises();

    await wrapper.find("[data-testid='refresh-users-button']").trigger("click");
    expect(usersStore.fetchUsers).toHaveBeenCalledTimes(2);
  });

  it("shows loading state when isLoading is true", () => {
    const usersStore = useUsersStore();
    usersStore.isLoading = true;
    const wrapper = mount(UsersPage);
    expect(wrapper.find("[data-testid='loading-state']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Memuat data pengguna...");
  });
});

