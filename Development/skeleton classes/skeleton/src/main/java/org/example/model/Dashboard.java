package org.example.model;


public class Dashboard {
    private int dashboardId;
    private String title;

    public Dashboard(int dashboardId, String title) {
        this.dashboardId = dashboardId;
        this.title = title;
    }

    public int getDashboardId() {
        return dashboardId;
    }

    public void setDashboardId(int dashboardId) {
        this.dashboardId = dashboardId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}