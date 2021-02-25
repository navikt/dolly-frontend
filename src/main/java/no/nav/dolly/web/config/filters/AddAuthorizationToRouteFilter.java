package no.nav.dolly.web.config.filters;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;

@Slf4j
@RequiredArgsConstructor
public class AddAuthorizationToRouteFilter extends ZuulFilter {
    private final GenerateToken generateToken;
    private final String route;

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 6;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return (ctx.get("proxy") != null) && ctx.get("proxy").equals(route);
    }

    @Override
    public Object run() throws ZuulException {
        try {
            RequestContext ctx = RequestContext.getCurrentContext();
            Object e = ctx.get("error.exception");
            if (e != null && e instanceof ZuulException) {
                ZuulException zuulException = (ZuulException) e;
                log.error("Zuul failure detected: " + zuulException.getMessage(), zuulException);

                // Remove error code to prevent further error handling in follow up filters
                ctx.remove("error.status_code");

                // Populate context with new response values
                ctx.setResponseBody("Overriding Zuul Exception Body");
                ctx.getResponse().setContentType("application/json");
                ctx.setResponseStatusCode(500); //Can set any error code as excepted
            }
            ctx.addZuulRequestHeader(HttpHeaders.AUTHORIZATION, "Bearer " + generateToken.getToken());
        } catch (Exception ex) {
            log.error("Exception filtering in custom error filter", ex);
        }
        return null;
    }
}
