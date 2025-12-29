<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Device Management</h1>

        <!-- Add Device Form -->
        <v-card class="mb-4" outlined>
          <v-card-title>Add Device</v-card-title>
          <v-card-text>
            <v-text-field v-model="newDevice.name" label="Device Name"></v-text-field>
            <v-text-field v-model="newDevice.ipAddress" label="IP Address"></v-text-field>
            <v-select
              v-model="newDevice.deviceType"
              :items="deviceTypes"
              label="Device Type"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="addDevice">Add Device</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Devices Table -->
        <v-data-table :headers="deviceHeaders" :items="devices" item-value="id">
          <template #item.status="{ item }">
            <v-chip :color="item.status==='active'?'green':'grey'" dark>{{ item.status }}</v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn color="primary" @click="activateDevice(item.id)" :disabled="item.status==='active'">
              Activate
            </v-btn>
            <v-btn color="error" @click="deactivateDevice(item.id)" :disabled="item.status==='inactive'">
              Deactivate
            </v-btn>
          </template>
        </v-data-table>

        <!-- Transactions Table -->
        <h2 class="mt-6">Transactions</h2>
        <v-data-table :headers="transactionHeaders" :items="transactions" item-value="transaction_id">
          <template #item.event_type="{ item }">
            <v-chip color="blue" dark>{{ item.event_type }}</v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiFetch } from '~/composables/useApiFetch';

interface Device {
  id: string;
  name: string;
  deviceType: string;
  ipAddress: string;
  status: string;
}

interface Transaction {
  transaction_id: string;
  device_id: string;
  username: string;
  event_type: string;
  timestamp: string;
  payload: object;
}

const devices = ref<Device[]>([]);
const transactions = ref<Transaction[]>([]);

const newDevice = ref({
  name: '',
  deviceType: 'access_controller',
  ipAddress: '',
});

const deviceTypes = ['access_controller','face_reader','anpr'];

const deviceHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Device Type', key: 'deviceType' },
  { title: 'IP Address', key: 'ipAddress' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions' },
];

const transactionHeaders = [
  { title: 'ID', key: 'transaction_id' },
  { title: 'Device ID', key: 'device_id' },
  { title: 'Username', key: 'username' },
  { title: 'Event Type', key: 'event_type' },
  { title: 'Timestamp', key: 'timestamp' },
];

const fetchDevices = async () => {
  devices.value = await apiFetch('/devices');
};

const fetchTransactions = async () => {
  transactions.value = await apiFetch('/devices/transactions');
};

const addDevice = async () => {
  await apiFetch('/devices', { method: 'POST', body: newDevice.value });
  newDevice.value.name = '';
  newDevice.value.ipAddress = '';
  fetchDevices();
};

const activateDevice = async (id: string) => {
  await apiFetch(`/devices/${id}/activate`, { method: 'POST' });
  fetchDevices();
};

const deactivateDevice = async (id: string) => {
  await apiFetch(`/devices/${id}/deactivate`, { method: 'POST' });
  fetchDevices();
};

onMounted(() => {
  fetchDevices();
  fetchTransactions();
  setInterval(fetchTransactions, 2000);
});
</script>
