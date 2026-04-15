package mk.codeit.earthquake.dto;

import lombok.Data;

@Data
public class EarthquakeDTO {
    private String title;
    private String place;
    private Double magnitude;
    private String magType;
    private Long time;
}