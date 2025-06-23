/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import '@/styles/gradient.css';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex justify-content-center align-items-center">
            <div className="animated-gradient-bg w-full">
                <div className="card w-10 h-full md:h-30rem">
                    <div className="grid h-full">
                        <div className="col-12 md:col-6 flex flex-col justify-center h-full px-4">
                            <div>
                                <img src="/layout/images/logo.png" style={{ maxWidth: '100%' }} className="h-4rem md:h-5rem" alt="logo" />
                                <h3 className="text-2xl font-bold mt-2 mb-10">Rumah Sakit</h3>

                                <form className="grid">
                                    <div className="col-12">
                                        <label htmlFor="email">Email</label>
                                        <InputText type="email" className="w-full mt-3" />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="password">Password</label>
                                        <InputText type="password" className="w-full mt-3" />
                                    </div>

                                    <div className="col-12 mt-3">
                                        <Button label="login" className="w-full" />
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="hidden md:block md:col-6 h-full">
                            <img src="/layout/images/login.png" className="w-full h-full object-cover" alt="cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
