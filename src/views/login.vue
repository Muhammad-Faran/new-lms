<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { showMessageAlert } from '../utils/alert';
import API from '../utils/baseApi';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false)

const handleLogin = async () => {
    try {
        loading.value = true

        const response = await axios.post(API.LOGIN, {
            email: email.value,
            password: password.value,
        });

        const token = response.data.data.personal_access_token;
        localStorage.setItem('user', JSON.stringify(response.data.data));


        if (token) {
            const expirationTime = Date.now() + (60 * 60 * 1000);
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_token_expiration', expirationTime);

            showMessageAlert({ message: 'Successfully Login', type: 'success' })
            router.push('/dashboard');
        } else {
            showMessageAlert({ message: 'Login failed', type: 'success' })
            console.error('No token returned from login');
        }
        loading.value = false
    } catch (error) {
        showMessageAlert({ message: 'Login failed', type: 'error' })
        console.error('Login failed', error);
        loading.value = false
    }
}

</script>

<template>
    <div
        class="flex min-h-full flex-1 flex-col justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black py-12 sm:px-6 lg:px-8 text-slate-800">
        <div class="sm:mx-auto sm:w-full sm:max-w-md items-center">
            <!-- <div class="flex justify-center">
                <img class="h-20 w-auto" src="/finova_logo.png" alt="Your Company" />
            </div> -->
            <h2 class="mt-20 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div
                class="bg-white/90 backdrop-blur px-6 py-12 shadow-md shadow-slate-200 sm:rounded-2xl sm:px-12 border border-slate-200">
                <form class="space-y-6" @submit.prevent="handleLogin">
                    <div>
                        <label for="email" class="block text-sm/6 font-medium text-slate-800">Email address</label>
                        <div class="mt-2">
                            <input v-model="email" placeholder="Email" id="email" name="email" type="email"
                                autocomplete="email" required=""
                                class="block w-full rounded-md border border-slate-200 bg-white py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-offset-0 sm:text-sm/6 transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm/6 font-medium text-slate-800">Password</label>
                        <div class="mt-2">
                            <input v-model="password" placeholder="Password" id="password" name="password"
                                type="password" autocomplete="current-password" required=""
                                class="block w-full rounded-md border border-slate-200 bg-white py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-offset-0 sm:text-sm/6 transition-colors" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox"
                                class="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                            <label for="remember-me" class="ml-3 block text-sm/6 text-slate-800">Remember me</label>
                        </div>

                        <div class="text-sm/6">
                            <a href="#" class="font-semibold text-emerald-600 hover:text-emerald-700">Forgot
                                password?</a>
                        </div>
                    </div>

                    <div v-loading="loading">
                        <button type="submit"
                            class="flex w-full justify-center rounded-md bg-gradient-to-b from-slate-950 via-slate-900 to-black px-4 py-2 text-sm/6 font-semibold text-white shadow-sm shadow-slate-300/50 hover:from-slate-900 hover:via-slate-800 hover:to-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 transition-colors">Sign
                            in</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style>
.example-showcase .el-loading-mask {
    z-index: 9;
}

svg.circular {
    width: 30px !important;
}
</style>
