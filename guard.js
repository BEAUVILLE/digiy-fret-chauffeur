/**
 * 🦅 DIGIY GUARD - Système d'authentification centralisé
 * Module: FRET PRO
 * Version: 2.0
 * Projet Supabase: wesqmwjjtsefyjnluosj
 */

(function() {
  'use strict';

  // Config Supabase
  const SUPABASE_URL = "https://wesqmwjjtsefyjnluosj.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc3Ftd2pqdHNlZnlqbmx1b3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzg4ODIsImV4cCI6MjA4MDc1NDg4Mn0.dZfYOc2iL2_wRYL3zExZFsFSBK6AbMeOid2LrIjcTdA";

  // Fonction pour obtenir/créer le client Supabase
  function getSupabaseClient() {
    if (typeof window.supabase === 'undefined') {
      console.error('❌ Supabase library not loaded');
      return null;
    }

    // Si un client existe déjà
    if (window.supa) {
      console.log('✅ Using existing Supabase client');
      return window.supa;
    }

    // Sinon créer un nouveau client
    try {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ New Supabase client created for guard');
      return client;
    } catch (err) {
      console.error('❌ Error creating Supabase client:', err);
      return null;
    }
  }

  // Fonction pour vérifier la session locale
  function checkLocalSession() {
    const sessionStr = localStorage.getItem('digiy_session');
    
    if (!sessionStr) {
      console.log('❌ No session in localStorage');
      return null;
    }

    try {
      const session = JSON.parse(sessionStr);
      const now = Date.now();

      // Vérifier expiration
      if (!session.expiry || session.expiry < now) {
        console.log('⏰ Session expired');
        localStorage.removeItem('digiy_session');
        return null;
      }

      // Vérifier que les champs requis existent
      if (!session.ownerId || !session.slug) {
        console.log('⚠️ Invalid session format');
        localStorage.removeItem('digiy_session');
        return null;
      }

      console.log('✅ Valid local session found');
      console.log('Owner ID:', session.ownerId);
      console.log('Slug:', session.slug);
      console.log('Expires:', new Date(session.expiry).toLocaleString());

      return session;
    } catch (err) {
      console.error('❌ Error parsing session:', err);
      localStorage.removeItem('digiy_session');
      return null;
    }
  }

  // Fonction principale du guard
  async function guardOrPay(moduleName = 'APP', loginUrl = '/digiy-fret-pro/pin.html') {
    console.log('🔐 DIGIY GUARD - Checking access for:', moduleName);

    // 1. Vérifier session locale
    const session = checkLocalSession();
    
    if (!session) {
      console.log('❌ No valid session - Redirecting to login');
      window.location.href = loginUrl;
      return false;
    }

    // 2. Session valide trouvée
    console.log('✅ Session valid - Access granted');
    
    return true;
  }

  // Exposer les fonctions globalement
  window.DIGIY = window.DIGIY || {};
  window.DIGIY.guardOrPay = guardOrPay;
  window.DIGIY.checkLocalSession = checkLocalSession;
  window.DIGIY.getSupabaseClient = getSupabaseClient;

  console.log('🦅 DIGIY Guard loaded - v2.0 (FRET PRO)');
  console.log('Supabase URL:', SUPABASE_URL);

})();
