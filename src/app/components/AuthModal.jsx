"use client";

import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { signIn, signUp } from '../../services/authService';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Iniciar sesión
                const { user } = await signIn(formData.email, formData.password);
                if (user) {
                    onSuccess && onSuccess(user);
                    onClose();
                }
            } else {
                // Registro
                if (formData.password !== formData.confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    return;
                }
                if (formData.password.length < 6) {
                    setError('La contraseña debe tener al menos 6 caracteres');
                    return;
                }

                const { user } = await signUp(formData.email, formData.password, formData.fullName);
                if (user) {
                    setError('');
                    alert('¡Registro exitoso! Revisa tu email para confirmar la cuenta.');
                    setIsLogin(true);
                }
            }
        } catch (err) {
            console.error('Error de autenticación:', err);
            if (err.message.includes('Invalid login credentials')) {
                setError('Email o contraseña incorrectos');
            } else if (err.message.includes('User already registered')) {
                setError('Este email ya está registrado');
            } else {
                setError(err.message || 'Error en la autenticación');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            email: '',
            password: '',
            fullName: '',
            confirmPassword: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-gray-900 rounded-lg max-w-md w-full mx-4 p-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </h2>
                    <p className="text-gray-400">
                        {isLogin 
                            ? 'Accede a tu cuenta para gestionar favoritos y reservas'
                            : 'Crea una cuenta para guardar favoritos y hacer reservas'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Nombre completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="Tu nombre completo"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                placeholder="Tu contraseña"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Confirmar contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="Confirma tu contraseña"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-600 text-white p-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
                        >
                            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={toggleMode}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                        {isLogin 
                            ? '¿No tienes cuenta? Regístrate aquí'
                            : '¿Ya tienes cuenta? Inicia sesión aquí'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
