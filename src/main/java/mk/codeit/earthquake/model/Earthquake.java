package mk.codeit.earthquake.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "earthquakes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Earthquake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String place;
    private Double magnitude;
    private String magType;
    private Long time;
    private Double latitude;
    private Double longitude;
}