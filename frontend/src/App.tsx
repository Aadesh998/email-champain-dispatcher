import React, { useState } from 'react';
import { View } from './types';
import { Sidebar } from './components/layout';
import { TemplatesPage, CampaignsPage } from './pages';
import { NewCampaignPage } from './pages/NewCampaignPage';
import { HelpPage } from './pages/HelpPage';

export default function App() {
  const [activeView, setActiveView] = useState<View>('campaigns');
  const [showCampaignFlow, setShowCampaignFlow] = useState(false);

  const renderContent = () => {
    if (showCampaignFlow) {
      return <NewCampaignPage onCancel={() => setShowCampaignFlow(false)} />;
    }

    switch (activeView) {
      case 'templates':
        return <TemplatesPage />;
      case 'campaigns':
        return <CampaignsPage onCreateClick={() => setShowCampaignFlow(true)} />;
      case 'draft-templates':
        return <TemplatesPage isDraft />;
      case 'draft-campaigns':
        return <CampaignsPage isDraft />;
      case 'help':
        return <HelpPage />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#111319' }}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onNavigate={() => setShowCampaignFlow(false)} 
      />
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </main>
    </div>
  );
}
