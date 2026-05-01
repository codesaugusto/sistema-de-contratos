package com.malloc.backend_contratos.infrastructure.exceptions;

import com.malloc.backend_contratos.infrastructure.exceptions.dto.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Enum inválido, campo com tipo errado (ex: status "renovado" não existia no enum) */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDTO> handleMessageNotReadable(
            HttpMessageNotReadableException ex, HttpServletRequest request) {
        String msg = "Dados inválidos: " + extractRootCause(ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(build(400, "BAD_REQUEST", msg, request));
    }

    /** @NotBlank, @NotNull, @Size, etc. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(build(400, "VALIDATION_ERROR", msg, request));
    }

    /** Entidade não encontrada */
    @ExceptionHandler(jakarta.persistence.EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(
            jakarta.persistence.EntityNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(build(404, "NOT_FOUND", ex.getMessage(), request));
    }

    /** Qualquer outra exceção não tratada */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(
            Exception ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(build(500, "INTERNAL_ERROR", "Ocorreu um erro interno. Tente novamente.", request));
    }

    private ErrorResponseDTO build(int status, String error, String message, HttpServletRequest request) {
        return ErrorResponseDTO.builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .error(error)
                .message(message)
                .path(request.getRequestURI())
                .build();
    }

    private String extractRootCause(Exception ex) {
        Throwable cause = ex;
        while (cause.getCause() != null) cause = cause.getCause();
        String msg = cause.getMessage();
        if (msg != null && msg.contains(":")) return msg.substring(msg.lastIndexOf(":") + 1).trim();
        return msg != null ? msg : "formato inválido";
    }
}

