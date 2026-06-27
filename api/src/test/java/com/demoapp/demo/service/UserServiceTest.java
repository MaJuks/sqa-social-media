package com.demoapp.demo.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  @Test
  void deveRetornarTrueParaSenhaValida() {
    assertTrue(userService.isPasswordValid("Senha@123"));
  }

  @Test
  void deveRetornarTrueParaEmailValido() {
    assertTrue(userService.isEmailValid("usuario@exemplo.com"));
  }

  // bug encontrado: isEmailValid só verifica se tem "@", então "usuario@" passa como válido
  @Test
  void deveRetornarFalseParaEmailSemDominio() {
    assertFalse(userService.isEmailValid("usuario@"));
  }
}
