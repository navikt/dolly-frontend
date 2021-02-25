package no.nav.dolly.web.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Slf4j
public class SessionTimeoutCookieFilter implements Filter {

    public static HttpSession session() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return attr.getRequest().getSession(true);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        long currentTime = System.currentTimeMillis();
        long expiryTime = currentTime + session().getMaxInactiveInterval() * 1000L;

        Cookie cookie = new Cookie("serverTime", "" + currentTime);
        cookie.setPath("/");

        httpResponse.addCookie(cookie);
        if (httpRequest.getRemoteUser() != null) {
            cookie = new Cookie("sessionExpiry", "" + expiryTime);
        } else {
            cookie = new Cookie("sessionExpiry", "" + currentTime);
        }
        cookie.setPath("/");
        httpResponse.addCookie(cookie);
        try {
        chain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Feil under sending gjennom filter", e);
        }
    }
}
