package com.globetales.dto;

import java.util.List;

public class UserListResponse<T> {
    private int count;
    private List<T> users;

    public UserListResponse(int count, List<T> users) {
        this.count = count;
        this.users = users;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<T> getUsers() {
        return users;
    }

    public void setUsers(List<T> users) {
        this.users = users;
    }
} 