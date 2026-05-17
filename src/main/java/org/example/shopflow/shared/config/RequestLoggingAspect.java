package org.example.shopflow.shared.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Req 5 — Load Distribution: logs every HTTP request with the INSTANCE_ID
 * so you can verify round-robin distribution across instances in terminal logs.
 */
@Aspect
@Component
@Slf4j
public class RequestLoggingAspect {

    @Value("${HOSTNAME:single}")
    private String instanceId;

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object logRequest(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (attrs == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attrs.getRequest();
        String method = request.getMethod();
        String uri = request.getRequestURI();

        log.info("[INSTANCE: {}] --> {} {} (handler: {})",
                instanceId, method, uri, joinPoint.getSignature().toShortString());

        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - start;

        log.info("[INSTANCE: {}] <-- {} {} completed in {}ms",
                instanceId, method, uri, duration);

        return result;
    }
}