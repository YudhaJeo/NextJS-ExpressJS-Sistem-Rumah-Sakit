// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(main)\(rawat_inap)\rawat_inap\page.js
'use client';

import { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Card } from 'primereact/card';

import { TabRawatInap, TabRuangan, TabApotek } from './dashboard_tabs';

const DashboardRawatInap = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabMenu = [
    { label: 'Dashboard Rawat Inap', icon: 'pi pi-home' },
    { label: 'Dashboard Ruangan', icon: 'pi pi-building' },
    { label: 'Dashboard Apotek', icon: 'pi pi-briefcase' },
  ];

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <TabRawatInap />;
      case 1:
        return <TabRuangan />;
      case 2:
        return <TabApotek />;
      default:
        return null;
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Card className="mb-4 shadow-md">
          <h1 className="text-xl font-semibold mb-3">
            Dashboard Monitoring Rawat Inap
          </h1>
          <TabMenu
            model={tabMenu}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          />
        </Card>
      </div>

      <div className="col-12">{renderContent()}</div>
    </div>
  );
};

export default DashboardRawatInap;
