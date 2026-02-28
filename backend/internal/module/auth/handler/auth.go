package handler

import (
	"net/http"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	authUsecase "github.com/durianpay/fullstack-boilerplate/internal/module/auth/usecase"
	"github.com/durianpay/fullstack-boilerplate/internal/openapigen"
	"github.com/durianpay/fullstack-boilerplate/internal/transport"
)

type AuthHandler struct {
	authUC authUsecase.AuthUsecase
}

func NewAuthHandler(authUC authUsecase.AuthUsecase) *AuthHandler {
	return &AuthHandler{
		authUC: authUC,
	}
}

func (a *AuthHandler) PostDashboardV1AuthLogin(w http.ResponseWriter, r *http.Request) {
	var req openapigen.PostDashboardV1AuthLoginJSONBody
	if !transport.DecodeJSONBody(w, r, &req) {
		return
	}
	accessToken, refreshToken, user, err := a.authUC.Login(req.Email, req.Password)
	if err != nil {
		transport.WriteError(w, err)
		return
	}

	response := openapigen.LoginResponse{
		Email:        &user.Email,
		Role:         &user.Role,
		Token:        &accessToken,
		RefreshToken: &refreshToken,
	}

	transport.WriteJSON(w, http.StatusOK, response)
}

func (a *AuthHandler) PostDashboardV1AuthRefresh(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refreshToken"`
	}
	if !transport.DecodeJSONBody(w, r, &req) {
		return
	}

	if req.RefreshToken == "" {
		transport.WriteAppError(w, entity.ErrorBadRequest("refresh token is required"))
		return
	}

	accessToken, refreshToken, err := a.authUC.RefreshAccessToken(req.RefreshToken)
	if err != nil {
		transport.WriteError(w, err)
		return
	}

	response := map[string]any{
		"token":        accessToken,
		"refreshToken": refreshToken,
	}

	transport.WriteJSON(w, http.StatusOK, response)
}
