import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Puzzle, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface IntegrationSettings {
    oauth_token?: string;
    refresh_token?: string;
    scope?: string[];
    expires_at?: string;
    account_id?: string;
}

interface Integration {
    id: string;
    name: string;
    status: 'connected' | 'disconnected';
    last_synced?: string;
    settings?: IntegrationSettings;
}

const AVAILABLE_INTEGRATIONS = [
    {
        id: 'quickbooks',
        name: 'QuickBooks',
        description: 'Sync your invoices and payments with QuickBooks for seamless accounting.',
        features: [
            'Automatic invoice sync',
            'Payment reconciliation',
            'Financial reporting'
        ],
        requiredScopes: ['accounting', 'payments']
    },
    {
        id: 'stripe',
        name: 'Stripe',
        description: 'Process credit card payments securely with Stripe\'s payment platform.',
        features: [
            'Secure card processing',
            'Automated receipts',
            'Payment analytics',
            'Subscription management',
            'Smart retries for failed payments'
        ],
        requiredScopes: ['payments']
    }
];

const IntegrationsSettings: React.FC = () => {
    const { user } = useAuth();
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectingId, setConnectingId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchIntegrations();
        }
    }, [user]);

    const fetchIntegrations = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('integrations')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;

            // Map the integrations data to include status
            const mappedIntegrations = AVAILABLE_INTEGRATIONS.map(integration => {
                const existingIntegration = data?.find(i => i.integration_id === integration.id);
                return {
                    id: integration.id,
                    name: integration.name,
                    status: existingIntegration ? 'connected' as const : 'disconnected' as const,
                    last_synced: existingIntegration?.last_synced,
                    settings: existingIntegration?.settings as IntegrationSettings
                };
            });

            setIntegrations(mappedIntegrations);
        } catch (error) {
            console.error('Error fetching integrations:', error);
            toast.error('Failed to fetch integrations');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (integrationId: string) => {
        setConnectingId(integrationId);

        try {
            // In a real implementation, this would redirect to the OAuth flow
            const integration = AVAILABLE_INTEGRATIONS.find(i => i.id === integrationId);

            // Simulate OAuth flow
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update the integration status
            const { error } = await supabase
                .from('integrations')
                .upsert({
                    user_id: user?.id,
                    integration_id: integrationId,
                    settings: {},
                    last_synced: new Date().toISOString()
                });

            if (error) throw error;

            // Update local state
            setIntegrations(prev =>
                prev.map(i =>
                    i.id === integrationId
                        ? { ...i, status: 'connected', last_synced: new Date().toISOString() }
                        : i
                )
            );

            toast.success(`Successfully connected to ${integration?.name}`);
        } catch (error) {
            console.error('Error connecting integration:', error);
            toast.error('Failed to connect integration');
        } finally {
            setConnectingId(null);
        }
    };

    const handleDisconnect = async (integrationId: string) => {
        try {
            const { error } = await supabase
                .from('integrations')
                .delete()
                .eq('user_id', user?.id)
                .eq('integration_id', integrationId);

            if (error) throw error;

            // Update local state
            setIntegrations(prev =>
                prev.map(i =>
                    i.id === integrationId
                        ? { ...i, status: 'disconnected', last_synced: undefined, settings: undefined }
                        : i
                )
            );

            toast.success('Integration disconnected successfully');
        } catch (error) {
            console.error('Error disconnecting integration:', error);
            toast.error('Failed to disconnect integration');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Puzzle className="h-5 w-5" />
                    Integrations
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Connect your ZaytrixFlow account with external services
                </p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-pulse">
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {integrations.map((integration) => {
                        const integrationDetails = AVAILABLE_INTEGRATIONS.find(i => i.id === integration.id);
                        return (
                            <motion.div
                                key={integration.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                {integrationDetails?.name}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${integration.status === 'connected'
                                                ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                }`}>
                                                {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                            {integrationDetails?.description}
                                        </p>

                                        {integration.status === 'connected' && integration.last_synced && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                Last synced: {new Date(integration.last_synced).toLocaleString()}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {integrationDetails?.features.map((feature, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        {integration.status === 'connected' ? (
                                            <button
                                                onClick={() => handleDisconnect(integration.id)}
                                                className="px-4 py-2 border border-error-300 text-error-600 dark:border-error-600 dark:text-error-400 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/30 transition-colors"
                                            >
                                                Disconnect
                                            </button>
                                        ) : (
                                            <motion.button
                                                onClick={() => handleConnect(integration.id)}
                                                disabled={!!connectingId}
                                                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                whileHover={{ scale: connectingId ? 1 : 1.02 }}
                                                whileTap={{ scale: connectingId ? 1 : 0.98 }}
                                            >
                                                {connectingId === integration.id ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Connecting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ExternalLink className="h-4 w-4" />
                                                        Connect
                                                    </>
                                                )}
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <div className="mt-8 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-primary-800 dark:text-primary-200 mb-1">
                            Need help with integrations?
                        </h4>
                        <p className="text-sm text-primary-700 dark:text-primary-300">
                            Check out our integration guides and documentation for detailed setup instructions
                            and troubleshooting tips.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsSettings; 